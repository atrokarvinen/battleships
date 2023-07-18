import { Player } from "../redux/playerSlice";

export type GamePlayerChangedPayload = {
  gameId: string;
  playerId: string;
  player?: Player;
};
