import { Types } from "mongoose";
import { GameState } from "./gameState";
import { IPlayer, PlayerDTO } from "./player";

export type IGame = {
  gameRoom: Types.ObjectId;

  activePlayerId?: string;
  players: IPlayer[];
  winnerId?: string;

  state: GameState;
};

export type GameDTO = {
  id: string;
  gameRoomId: string;
  activePlayerId?: string;
  players: PlayerDTO[];
  winnerId?: string;
  state: GameState;
};
