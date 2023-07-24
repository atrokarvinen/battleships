import { Player } from "../redux/playerSlice";

export type PlayerLeftPayload = {
  gameId: string;
  playerId: string;
};

export type PlayerJoinedPayload = {
  gameId: string;
  player: Player;
};
