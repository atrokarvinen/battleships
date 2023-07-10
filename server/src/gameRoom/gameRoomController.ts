import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { IGameRoom } from "../database/gameRoom";
import { GameRoomService } from "./gameRoomService";

export class GameRoomController {
  private io: Server;
  private gameRoomService: GameRoomService = new GameRoomService();

  constructor(io: Server) {
    this.io = io;
  }

  async getGameRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const gameDtos = await this.gameRoomService.getGameRooms();
      return res.json(gameDtos);
    } catch (error) {
      return next(error);
    }
  }

  async getGameRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const gameId = req.params.id;
      const gameDto = await this.gameRoomService.getGameRoom(gameId);
      if (!gameDto) {
        return res.status(403).end();
      }
      return res.json(gameDto);
    } catch (error) {
      next(error);
    }
  }

  async getGameInRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: gameRoomId } = req.params;
      const gameDto = await this.gameRoomService.getGameInRoom(gameRoomId);
      if (!gameDto) {
        return res
          .status(404)
          .json({ error: `Game in game room '${gameRoomId}' not found` });
      }
      console.log(`Found game in game room '${gameRoomId}'`);
      return res.json(gameDto);
    } catch (error) {
      next(error);
    }
  }

  async createGameRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: IGameRoom = req.body;
      const gameDto = await this.gameRoomService.createGameRoom(payload);
      this.io.emit("gameCreated", gameDto);
      return res.json(gameDto);
    } catch (error) {
      next(error);
    }
  }

  async deleteGameRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const gameRoomId = req.params.id;
      await this.gameRoomService.deleteGameRoom(gameRoomId);
      this.io.emit("gameDeleted", gameRoomId);
      return res.end();
    } catch (error) {
      next(error);
    }
  }

  async joinGame(req: Request, res: Response, next: NextFunction) {
    try {
      const gameRoomId = req.body.gameId;
      const userId = req.userId;

      // TODO probably not need to send username, should be derived from userId
      const username = await this.gameRoomService.joinGame(gameRoomId, userId);

      this.io.emit("gameJoined", {
        gameId: gameRoomId,
        playerId: userId,
        player: { id: userId, username },
      });
      return res.end();
    } catch (error) {
      next(error);
    }
  }

  async leaveGame(req: Request, res: Response, next: NextFunction) {
    try {
      const gameRoomId = req.body.gameId;
      const userId = req.userId;

      console.log(`Leaving game ${gameRoomId}...`);

      await this.gameRoomService.leaveGame(gameRoomId, userId);

      this.io.emit("gameLeft", { gameId: gameRoomId, playerId: userId });
      return res.end();
    } catch (error) {
      next(error);
    }
  }
}
