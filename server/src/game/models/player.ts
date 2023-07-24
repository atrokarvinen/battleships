import { Types } from "mongoose";
import { Square } from "./square";

export type IPlayer = {
  playerId: Types.ObjectId;
  ownShips: Square[];
  attacks: Square[];
};

export type PlayerDTO = {
  playerId: string;
  ownShips: Square[];
  attacks: Square[];
};
