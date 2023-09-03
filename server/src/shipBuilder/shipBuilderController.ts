import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { filterGameInfo } from "../game/services/info-filter";
import { ShipBuilderService } from "./shipBuilderService";

export class ShipBuilderController {
  private io: Server;
  private shipBuilderService = new ShipBuilderService();

  constructor(io: Server) {
    this.io = io;
  }

  transformShip = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await this.shipBuilderService.transformShip(req.body);
      res.end();
    } catch (error) {
      next(error);
    }
  };

  confirmPlacements = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const userId = req.userId;
      const { gameId } = req.body;
      const gameDto = await this.shipBuilderService.confirm(userId, gameId);

      const { selfInfo, opponentInfo } = filterGameInfo(userId, gameDto);

      const bothReady = gameDto.players.every((p) => p.placementsReady);
      const gameRoomId = gameDto.gameRoom.id;
      const event = bothReady ? "gameStarted" : "playerConfirmedPlacements";
      const message = bothReady ? opponentInfo : userId;
      this.io.to(gameRoomId).except(req.socketId).emit(event, message);

      return res.json(selfInfo);
    } catch (error) {
      next(error);
    }
  };
}
