import { NextFunction, Request, Response } from "express";
import { GameRoom } from "../database/gameRoom";
import { UserDTO } from "../database/user";

export class PlayerController {
  async getPlayers(req: Request, res: Response, next: NextFunction) {
    try {
      const allGameRooms = await GameRoom.find({}).populate(
        "players",
        "-password"
      );

      const gameDtos = allGameRooms.map((g) => g.toObject());
      const playerDtos: UserDTO[] = gameDtos
        .map((g) => g.players as any)
        .flat();

      return res.json(playerDtos);
    } catch (error) {
      next(error);
    }
  }
}
