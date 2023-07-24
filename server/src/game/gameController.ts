import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { GameRoomService } from "../gameRoom/gameRoomService";
import { StartGamePayload } from "./api/startGamePayload";
import { GameOptions } from "./models/gameOptions";
import { GameService } from "./services/gameService";

export class GameController {
  private gameDbService = new GameService();
  private gameRoomService = new GameRoomService();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async startGame(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameRoomId, playerIds }: StartGamePayload = req.body;

      console.log("Starting game:", req.body);

      const firstPlayerId = this.randomizeFirstPlayer(playerIds);
      let game = await this.gameRoomService.getGameInRoom(gameRoomId);
      const options: GameOptions = { gameRoomId, playerIds, firstPlayerId };
      if (!game) {
        console.log("Creating new game");
        game = await this.gameDbService.createEmptyGame(options);
        await this.gameRoomService.setGameInRoom(gameRoomId, game.id);
      } else {
        console.log("Resetting old game");
        game = await this.gameDbService.resetGame(options);
      }
      const startedGame = await this.gameDbService.randomizePlacements(game.id);

      console.log("Started game:", startedGame.id);
      this.io.except(req.socketId).emit("gameStarted", startedGame);
      return res.json(startedGame);
    } catch (error) {
      next(error);
    }
  }

  async confirmPlacements(req: Request, res: Response, next: NextFunction) {
    try {
      const gameRoomId = req.params.gameRoomId;
      const userId = req.userId;

      res.end();
    } catch (error) {
      next(error);
    }
  }

  async attackSquare(req: Request, res: Response, next: NextFunction) {
    try {
      const { point, attackerPlayerId, gameId } = req.body;
      const result = await this.gameDbService.attackSquare({
        point,
        attackerPlayerId,
        gameId,
      });
      const attackResult = {
        hasShip: result.shipHit,
        nextPlayerId: result.nextPlayerId,
        isGameOver: result.isGameOver,
        point,
        attackerPlayerId,
        winnerPlayerId: result.isGameOver ? attackerPlayerId : undefined,
      };
      this.io.except(req.socketId).emit("squareAttacked", attackResult);
      return res.json(attackResult);
    } catch (error) {
      next(error);
    }
  }

  private randomizeFirstPlayer(playerIds: string[]) {
    const playerCount = playerIds.length;
    // Todo fix seeding for tests
    // const startingIndex = Math.round((Math.random() - 0.5) * playerCount);
    const startingIndex = 0;
    const firstPlayerId = playerIds[startingIndex];
    return firstPlayerId;
  }

  async endGame(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameRoomId } = req.body;
      const game = await this.gameDbService.deleteGamesFromRoom(gameRoomId);
      res.json(game);
    } catch (error) {
      next(error);
    }
  }

  async resetGame(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Not implemented");
      res.end();
    } catch (error) {
      next(error);
    }
  }
}
