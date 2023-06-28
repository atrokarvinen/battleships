import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { Game, GameState } from "../database/game";
import { DbService } from "./database/dbService";

export type StartGamePayload = {
  gameRoomId: string;
  playerIds: string[];
};

export type ResetGamePayload = {
  gameRoomId: string;
};

export class GameController {
  private gameDbService = new DbService();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async getGame(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameRoomId } = req.params;
      console.log(`Getting game of game room '${gameRoomId}'...`);
      const game = await this.gameDbService.getGameByRoomId(gameRoomId);
      if (!game) {
        return res
          .status(404)
          .json({ error: `Game for game room '${gameRoomId}' not found` });
      }
      console.log(`Found game of game room '${gameRoomId}'`);
      return res.json({ game });
    } catch (error) {
      next(error);
    }
  }

  async startGame(
    req: Request<{}, {}, StartGamePayload>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { gameRoomId, playerIds } = req.body;

      console.log("Starting game:", req.body);

      const firstPlayerId = this.randomizeFirstPlayer(playerIds);

      await this.gameDbService.deleteGamesFromRoom(gameRoomId);
      const initialGame = await this.gameDbService.initializeGame(
        gameRoomId,
        playerIds
      );
      const startedGame = await this.gameDbService.initializeRandomGame(
        initialGame.id
      );

      this.io.emit("gameStarted", startedGame);
      res.json(startedGame);
      console.log("Started game:", startedGame.id);
    } catch (error) {
      next(error);
    }
  }

  randomizeFirstPlayer(playerIds: string[]) {
    const playerCount = playerIds.length;
    const startingIndex = Math.round((Math.random() - 0.5) * playerCount);
    const firstPlayerId = playerIds[startingIndex];
    return firstPlayerId;
  }

  async endGame(req: Request, res: Response, next: NextFunction) {
    try {
      res.end();
    } catch (error) {
      next(error);
    }
  }

  async resetGame(
    req: Request<{}, {}, ResetGamePayload>,
    res: Response,
    next: NextFunction
  ) {
    try {
      const { gameRoomId } = req.body;

      console.log("Resetting game:", gameRoomId);

      const gameToReset = await Game.findOne({ gameRoomId });
      if (!gameToReset) {
        return res.status(404).json({ error: "Game not found" });
      }

      gameToReset.state = GameState.ENDED;
      await gameToReset.save();

      res.end();
      console.log("Reset game:", gameRoomId);
    } catch (error) {
      next(error);
    }
  }

  async guessCell(req: Request, res: Response, next: NextFunction) {
    try {
      const { point, guesserPlayerId, gameId } = req.body;
      const result = await this.gameDbService.guessCell({
        point,
        guesserPlayerId,
        gameId,
      });
      const guessResult = {
        hasBoat: result.shipHit,
        nextPlayerId: result.nextPlayerId,
        isGameOver: result.isGameOver,
        point,
        playerId: guesserPlayerId,
      };
      this.io.emit("squareGuessed", guessResult);
      return res.json(guessResult);
    } catch (error) {
      next(error);
    }
  }
}
