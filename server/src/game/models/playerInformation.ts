import { Square } from "./square";

export type PlayerInformation = {
  playerId: string;
  ownShips: Square[];
  attacks: Square[];
};
