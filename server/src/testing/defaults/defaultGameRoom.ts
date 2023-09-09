import { IGameRoom } from "../../gameRoom/models/gameRoom";
import { OpponentType } from "../../gameRoom/models/opponentType";

export const defaultGameRoom: IGameRoom = {
  createdAt: new Date(),
  createdBy: "test user",
  title: "test game",
  players: [],
  opponentType: OpponentType.HUMAN,
};
