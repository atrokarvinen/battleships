import { IGameRoom, OpponentType } from "../../database/gameRoom";

export const defaultGameRoom: IGameRoom = {
  createdAt: new Date(),
  createdBy: "test user",
  title: "test game",
  players: [],
  opponentType: OpponentType.HUMAN,
};
