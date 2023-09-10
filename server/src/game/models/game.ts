import { Types } from "mongoose";
import { GameRoomDTO } from "../../gameRoom/models/gameRoom";
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
  gameRoom: GameRoomDTO;
  activePlayerId?: string;
  winnerPlayerId?: string;
  players: PlayerDTO[];
  state: GameState;
};
