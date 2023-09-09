import { NextFunction, Request, Response } from "express";
import { UserDTO } from "../auth/models/user";
import { GameRoom } from "../gameRoom/gameRoomSchema";

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

      res.json(playerDtos);
    } catch (error) {
      next(error);
    }
  }
}
