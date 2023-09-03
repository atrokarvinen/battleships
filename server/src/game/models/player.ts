import { Types } from "mongoose";
import { Point } from "./point";
import { Ship, ShipDTO } from "./ship";

export type IPlayer = {
  playerId: Types.ObjectId;
  ownShips: Ship[];
  attacks: Point[];
  placementsReady: boolean;
  isAi: boolean;
};

export type PlayerDTO = {
  playerId: string;
  ownShips: ShipDTO[];
  attacks: Point[];
  placementsReady: boolean;
  isAi: boolean;
};
