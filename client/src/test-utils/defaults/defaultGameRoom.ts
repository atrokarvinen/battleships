import { OpponentType } from "../../lobby/createGameRoom/createGame";
import { GameRoom } from "../../lobby/gameRoom";

export const defaultGameRoom: GameRoom = {
  id: "1",
  createdAt: new Date().toISOString(),
  createdBy: "test",
  opponentType: OpponentType.HUMAN,
  players: [],
  title: "test title",
};
