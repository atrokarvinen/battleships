import { Schema, model } from "mongoose";
import { toObjectOptions } from "../../database/dbOptions";
import { Board } from "../models/board";
import { Game } from "../models/game";
import { PlayerInformation } from "../models/playerInformation";
import { Point } from "../models/point";
import { Square } from "../models/square";
import { Ship } from "./model";

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

const gameSchema = new Schema<Game>(
  {
    gameRoomId: String,
    activePlayerId: String,
    winnerId: String,
    playerIds: [String],
    state: Number,
    playerInfos: [playerInfoSchema],
  },
  { toObject: toObjectOptions }
);

export const GameModel = model("game", gameSchema);
