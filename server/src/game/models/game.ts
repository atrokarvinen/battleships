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

export type GameDTO = {
  id: string;
  gameRoomId: string;
  activePlayerId?: string;
  playerIds: string[];
  playerInfos: PlayerInformation[];
  winnerId?: string;
  state: GameState;
};
