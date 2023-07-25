import { Types } from "mongoose";
import { GameState } from "./gameState";
import { IPlayer, PlayerDTO } from "./player";

export type IGame = {
  gameRoom: Types.ObjectId;

  activePlayerId?: string;
  winnerPlayerId?: string;
  players: IPlayer[];

  state: GameState;
};

export type GameDTO = {
  id: string;
  gameRoomId: string;
  activePlayerId?: string;
  winnerPlayerId?: string;
  players: PlayerDTO[];
  state: GameState;
};
