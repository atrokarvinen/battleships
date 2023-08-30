import { Types } from "mongoose";
import { GameRoomDTO } from "../../database/gameRoom";
import { GameState } from "./gameState";
import { IPlayer, Player } from "./player";

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
  players: Player[];
  state: GameState;
};
