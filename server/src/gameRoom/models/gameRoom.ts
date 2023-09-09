import { Types } from "mongoose";
import { UserDTO } from "../../auth/models/user";
import { GameDTO } from "../../game/models";
import { OpponentType } from "./opponentType";

export interface IGameRoom {
  id?: string;
  title: string;
  opponentType: OpponentType;
  players: GameRoomPlayer[];
  game?: Types.ObjectId;
  createdBy: string;
  createdAt: Date;
}

export type GameRoomPlayer = {
  id: string;
  username: string;
  isAi: boolean,
};

export type GameRoomDTO = {
  id: string;
  title: string;
  opponentType: OpponentType;
  players: UserDTO[];
  game?: GameDTO;
  createdBy: string;
  createdAt: Date;
};
