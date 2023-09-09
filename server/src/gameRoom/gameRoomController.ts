import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { filterGameInfo } from "../game/services/info-filter";
import { GameRoomService } from "./gameRoomService";
import { IGameRoom } from "./models/gameRoom";

export class GameRoomController {
  private io: Server;
  private gameRoomService: GameRoomService = new GameRoomService();

  constructor(io: Server) {
    this.io = io;
  }

  getGameRooms = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameDtos = await this.gameRoomService.getGameRooms();
      return res.json(gameDtos);
    } catch (error) {
      return next(error);
    }
  };

  getGameRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameRoomId = req.params.id;
      const gameRoomDto = await this.gameRoomService.getGameRoom(gameRoomId);
      if (!gameRoomDto) {
        return res
          .status(404)
          .json({ error: `Game room '${gameRoomId}' not found` });
      }
      return res.json(gameRoomDto);
    } catch (error) {
      next(error);
    }
  };

  getGameInRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { id: gameRoomId } = req.params;
      const gameDto = await this.gameRoomService.getGameInRoom(gameRoomId);
      if (!gameDto) {
        return res
          .status(404)
          .json({ error: `Game in game room '${gameRoomId}' not found` });
      }
      console.log(`Found game in game room '${gameRoomId}'`);

      // Return only information that is visible to the player
      const { selfInfo } = filterGameInfo(req.userId, gameDto);

      return res.json(selfInfo);
    } catch (error) {
      next(error);
    }
  };

  createGameRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: IGameRoom = req.body;
      const gameRoomToCreate = { ...payload, createdBy: req.userId };
      const gameDto = await this.gameRoomService.createGameRoom(
        gameRoomToCreate
      );
      this.io.except(req.socketId).emit("gameCreated", gameDto);
      return res.json(gameDto);
    } catch (error) {
      next(error);
    }
  };

  deleteGameRoom = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameRoomId = req.params.id;
      const gameRoom = await this.gameRoomService.getGameRoom(gameRoomId);
      if (!gameRoom) {
        return res.end();
      }
      if (gameRoom.createdBy !== req.userId) {
        return res.status(403).json({
          error: "Only the creator of the game room can delete it",
        });
      }
      await this.gameRoomService.deleteGameRoom(gameRoomId);
      this.io.except(req.socketId).emit("gameDeleted", gameRoomId);
      res.end();
    } catch (error) {
      next(error);
    }
  };

  joinGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameRoomId = req.body.gameId;
      const userId = req.userId;

      const player = await this.gameRoomService.joinGame(gameRoomId, userId);

      const response = { gameId: gameRoomId, player };
      this.io.except(req.socketId).emit("gameJoined", response);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  };

  leaveGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const gameRoomId = req.body.gameId;
      const userId = req.userId;

      console.log(`Leaving game ${gameRoomId}...`);

      await this.gameRoomService.leaveGame(gameRoomId, userId);

      const response = { gameId: gameRoomId, playerId: userId };
      this.io.except(req.socketId).emit("gameLeft", response);
      return res.json(response);
    } catch (error) {
      next(error);
    }
  };
}
