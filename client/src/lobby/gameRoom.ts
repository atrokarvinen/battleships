import { Player } from "../redux/playerSlice";

export type GameRoom = {
  id: string;
  title: string;
  players: Player[];
};
