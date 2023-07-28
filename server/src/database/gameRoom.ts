import { model, Schema, Types } from "mongoose";
import { GameDTO } from "../game/models";
import { toObjectOptions } from "./dbOptions";
import { UserDTO } from "./user";

export interface IGameRoom {
  id?: string;
  title: string;
  players: Types.ObjectId[];
  game?: Types.ObjectId;
  createdBy: string;
  createdAt: Date;
}

export type GameRoomDTO = {
  id: string;
  title: string;
  players: UserDTO[];
  game?: GameDTO;
  createdBy: string;
  createdAt: Date;
};

export const gameRoomSchema = new Schema<IGameRoom>(
  {
    title: { type: String, required: true },
    players: [{ ref: "user", type: Schema.Types.ObjectId }],
    game: { ref: "game", type: Schema.Types.ObjectId },
    createdBy: String,
    createdAt: { type: Date, default: Date.now },
  },
  { toObject: toObjectOptions }
);

export const GameRoom = model<IGameRoom>("gameRoom", gameRoomSchema);
