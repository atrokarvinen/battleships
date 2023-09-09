import { GameRoomDTO } from "../../gameRoom/models/gameRoom";
import { defaultGameRoom } from "./defaultGameRoom";

export const defaultGameRoomDto: GameRoomDTO = {
  ...defaultGameRoom,
  id: "1",
  players: [],
  game: undefined,
};
