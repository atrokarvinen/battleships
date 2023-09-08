import { Types } from "mongoose";
import { IPlayer, PlayerDTO } from "../../game/models";

export const defaultPlayer: IPlayer = {
  attacks: [],
  isAi: false,
  ownShips: [],
  placementsReady: false,
  playerId: new Types.ObjectId(),
};

export const defaultPlayerDto: PlayerDTO = {
  ...defaultPlayer,
  ownShips: [],
  playerId: "1",
};
