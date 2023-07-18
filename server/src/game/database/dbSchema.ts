import { Schema, model } from "mongoose";
import { toObjectOptions } from "../../database/dbOptions";
import {
  Board,
  IGame,
  PlayerInformation,
  Point,
  Ship,
  Square,
} from "../models";

const pointSchema = new Schema<Point>(
  {
    x: Number,
    y: Number,
  },
  { _id: false }
);

const squareSchema = new Schema<Square>(
  {
    ship: Number,
    hasBeenAttacked: Boolean,
    hasShip: Boolean,
    point: pointSchema,
    isVertical: Boolean,
  },
  { _id: false }
);

const shipSchema = new Schema<Ship>(
  { length: Number, start: pointSchema, isVertical: Boolean },
  { _id: false }
);

const boardSchema = new Schema<Board>(
  {
    playerId: String,
    ships: [shipSchema],
    squares: [squareSchema],
  },
  { toObject: toObjectOptions }
);

const playerInfoSchema = new Schema<PlayerInformation>(
  {
    playerId: String,
    attacks: [squareSchema],
    ownShips: [squareSchema],
  },
  { toObject: toObjectOptions }
);

const gameSchema = new Schema<IGame>(
  {
    gameRoom: { ref: "gameRoom", type: Schema.Types.ObjectId },
    activePlayerId: String,
    winnerId: String,
    playerIds: [String],
    state: Number,
    playerInfos: [playerInfoSchema],
  },
  { toObject: toObjectOptions }
);

export const GameModel = model("game", gameSchema);
