import { model, Schema, Types } from "mongoose";
import { GameDTO } from "../game/models";
import { toObjectOptions } from "./dbOptions";
import { UserDTO } from "./user";

export interface IGameRoom {
  id?: string;
  title: string;
  players: Types.ObjectId[];
  game?: Types.ObjectId;
}

export type GameRoomDTO = {
  id: string;
  title: string;
  players: UserDTO[]; 
  game?: GameDTO;
}

export const gameRoomSchema = new Schema<IGameRoom>(
  {
    title: { type: String, required: true },
    players: [{ ref: "user", type: Schema.Types.ObjectId }],
    game: { ref: "game", type: Schema.Types.ObjectId },
  },
  { toObject: toObjectOptions }
);

export const GameRoom = model<IGameRoom>("gameRoom", gameRoomSchema);
