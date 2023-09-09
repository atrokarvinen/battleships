import { Schema, model } from "mongoose";
import { toObjectOptions } from "../../core/dbOptions";
import { IGame, IPlayer, Point, Ship, Square } from "../models";

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
  { toObject: toObjectOptions }
);

const playerSchema = new Schema<IPlayer>(
  {
    playerId: String,
    attacks: [pointSchema],
    ownShips: [shipSchema],
    placementsReady: Schema.Types.Boolean,
    isAi: Schema.Types.Boolean,
  },
  { toObject: toObjectOptions }
);

const gameSchema = new Schema<IGame>(
  {
    gameRoom: { ref: "gameRoom", type: Schema.Types.ObjectId },
    activePlayerId: String,
    winnerPlayerId: String,
    state: Number,
    players: [playerSchema],
  },
  { toObject: toObjectOptions }
);

export const GameModel = model("game", gameSchema);
