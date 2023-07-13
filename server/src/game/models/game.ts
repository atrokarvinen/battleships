import { Types } from "mongoose";
import { GameState } from "./gameState";
import { PlayerInformation } from "./playerInformation";

export type IGame = {
  gameRoom: Types.ObjectId;

  activePlayerId?: string;
  playerIds: string[];
  playerInfos: PlayerInformation[];
  winnerId?: string;

  state: GameState;
};

export type GameDTO = Game & { id: string };

export type Game = {
  gameRoomId: string;

  activePlayerId: string;
  playerIds: string[];
  playerInfos: PlayerInformation[];
  winnerId: string;

  state: GameState;
};
