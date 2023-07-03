import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
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
        playerId: attackerPlayerId,
      };
      this.io.emit("squareAttacked", attackResult);
      return res.json(attackResult);
    } catch (error) {
      next(error);
    }
  }

  private randomizeFirstPlayer(playerIds: string[]) {
    const playerCount = playerIds.length;
    const startingIndex = Math.round((Math.random() - 0.5) * playerCount);
    const firstPlayerId = playerIds[startingIndex];
    return firstPlayerId;
  }

  async endGame(req: Request, res: Response, next: NextFunction) {
    try {
      console.log("Not implemented");
      res.end();
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
