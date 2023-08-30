import { Types } from "mongoose";
import { Point } from "./point";
import { Ship } from "./ship";

export type IPlayer = {
  playerId: Types.ObjectId;
  ownShips: Ship[];
  attacks: Point[];
};

export type Player = {
  playerId: string;
  ownShips: Ship[];
  attacks: Point[];
};
