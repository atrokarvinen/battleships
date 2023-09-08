import { Types } from "mongoose";
import { GameDTO, GameState, IGame } from "../../game/models";
import { defaultGameRoomDto } from "./defaultGameRoomDto";

export const defaultGame: IGame = {
  state: GameState.UNKNOWN,
  players: [],
  gameRoom: new Types.ObjectId(),
};

export const defaultGameDto: GameDTO = {
  id: "1",
  gameRoom: { ...defaultGameRoomDto },
  players: [],
  state: GameState.UNKNOWN,
};
