import { model, Schema, Types } from "mongoose";
import { GameDTO } from "../game/models";
import { toObjectOptions } from "./dbOptions";
import { UserDTO } from "./user";

export interface IGameRoom {
  id?: string;
  title: string;
  opponentType: OpponentType;
  players: Types.ObjectId[];
  game?: Types.ObjectId;
  createdBy: string;
  createdAt: Date;
}

export type GameRoomDTO = {
  id: string;
  title: string;
  opponentType: OpponentType;
  players: UserDTO[];
  game?: GameDTO;
  createdBy: string;
  createdAt: Date;
};

export enum OpponentType {
  UNKNOWN,
  HUMAN,
  COMPUTER,
}

export const gameRoomSchema = new Schema<IGameRoom>(
  {
    title: { type: String, required: true },
    opponentType: { type: Number, required: true },
    players: [{ ref: "user", type: Schema.Types.ObjectId }],
    game: { ref: "game", type: Schema.Types.ObjectId },
    createdBy: String,
    createdAt: { type: Date, default: Date.now },
  },
  { toObject: toObjectOptions }
);

export const GameRoom = model<IGameRoom>("gameRoom", gameRoomSchema);
