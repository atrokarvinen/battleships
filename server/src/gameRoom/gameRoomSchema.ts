import { model, Schema } from "mongoose";
import { toObjectOptions } from "../core/dbOptions";
import { GameRoomPlayer, IGameRoom } from "./models/gameRoom";

const gameRoomPlayerSchema = new Schema<GameRoomPlayer>(
  {
    id: String,
    username: String,
    isAi: Boolean,
  },
  { _id: false }
);

export const gameRoomSchema = new Schema<IGameRoom>(
  {
    title: { type: String, required: true },
    opponentType: { type: Number, required: true },
    players: [gameRoomPlayerSchema],
    game: { ref: "game", type: Schema.Types.ObjectId },
    createdBy: String,
    createdAt: { type: Date, default: Date.now },
  },
  { toObject: toObjectOptions }
);

export const GameRoom = model<IGameRoom>("gameRoom", gameRoomSchema);
