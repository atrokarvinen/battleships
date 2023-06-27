import { Schema, model } from "mongoose";
import { Board, Boat, Cell, Game, PlayerInformation, Point } from "./model";
import { toObjectOptions } from "../../database/dbOptions";

const pointSchema = new Schema<Point>(
  {
    x: Number,
    y: Number,
  },
  { _id: false }
);

const cellSchema = new Schema<Cell>(
  {
    boat: Number,
    hasBeenGuessed: Boolean,
    hasBoat: Boolean,
    point: pointSchema,
    isVertical: Boolean,
  },
  { _id: false }
);

const boatSchema = new Schema<Boat>(
  { length: Number, start: pointSchema, isVertical: Boolean },
  { _id: false }
);

const boardSchema = new Schema<Board>(
  {
    playerId: String,
    boats: [boatSchema],
    cells: [cellSchema],
  },
  { toObject: toObjectOptions }
);

const playerInfoSchema = new Schema<PlayerInformation>(
  {
    playerId: String,
    guesses: [cellSchema],
    ownShips: [cellSchema],
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
    // boards: [boardSchema],
    playerInfos: [playerInfoSchema],
  },
  { toObject: toObjectOptions }
);

export const GameModel = model("gamev2", gameSchema);
