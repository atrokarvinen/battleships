import { GameRoomDTO } from "../../database/gameRoom";
import { defaultGameRoom } from "./defaultGameRoom";

export const defaultGameRoomDto: GameRoomDTO = {
  ...defaultGameRoom,
  id: "1",
  players: [],
  game: undefined,
};
