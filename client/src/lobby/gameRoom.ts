import { OpponentType } from "./createGameRoom/createGame";

export type GameRoom = {
  id: string;
  title: string;
  opponentType: OpponentType;
  players: GameRoomPlayer[];
  createdBy: string;
  createdAt: string;
};

export type GameRoomPlayer = {
  id: string;
  username: string;
};
