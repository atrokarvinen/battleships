import { rest } from "msw";
import { setupServer } from "msw/node";
import { config } from "../config/config";
import { defaultGameRoom } from "../test-utils/defaults/defaultGameRoom";
import { CreateGame } from "./createGameRoom/createGame";
import { GameRoom } from "./gameRoom";

export const USER_ID = "1";
export const GAMEROOM_ID = "1";

const baseURL = config.backendBaseUrl;

export const handlers = [
  rest.get(`${baseURL}/game-room`, async (req, res, ctx) => {
    const gameRooms: GameRoom[] = [
      { ...defaultGameRoom, id: GAMEROOM_ID, createdBy: USER_ID },
    ];
    return res(ctx.json(gameRooms));
  }),
  rest.post(`${baseURL}/game-room`, async (req, res, ctx) => {
    const body: CreateGame = await req.json();
    const response: GameRoom = {
      ...defaultGameRoom,
      title: body.title,
      opponentType: body.opponentType,
    };
    return res(ctx.json(response));
  }),
  rest.delete(`${baseURL}/game-room/${GAMEROOM_ID}`, async (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];

export const server = setupServer(...handlers);
