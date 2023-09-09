import { model, Schema } from "mongoose";
import { toObjectOptions } from "../core/dbOptions";
import { IGameRoom } from "./models/gameRoom";

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
