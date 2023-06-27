import { model, Schema, Types } from "mongoose";
import { toObjectOptions } from "./dbOptions";

export interface IGameRoom {
  id?: string;
  title: string;
  players: Types.ObjectId[];
}

export const gameRoomSchema = new Schema<IGameRoom>(
  {
    title: { type: String, required: true },
    players: [{ ref: "user", type: Schema.Types.ObjectId }],
  },
  { toObject: toObjectOptions }
);

export const GameRoom = model<IGameRoom>("gameRoom", gameRoomSchema);
