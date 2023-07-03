import { GameState } from "./gameState";
import { PlayerInformation } from "./playerInformation";

export type Game = {
  gameRoomId: string;

  activePlayerId: string;
  playerIds: string[];
  playerInfos: PlayerInformation[];
  winnerId: string;

  state: GameState;

  // boards: Board[];
};
