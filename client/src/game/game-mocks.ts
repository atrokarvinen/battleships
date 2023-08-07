import { rest } from "msw";
import { setupServer } from "msw/node";
import { config } from "../config/config";
import { GameRoom } from "../lobby/gameRoom";
import { defaultGameRoom } from "../test-utils/defaults/defaultGameRoom";
import { GameDTO, GameState } from "./apiModel";
import { defaultSquare } from "./defaults";

const baseURL = config.backendBaseUrl;

export const handlers = [
  rest.get(`${baseURL}/account`, (req, res, ctx) =>
    res(
      ctx.json({
        userId: "1",
        username: "Player 1",
      })
    )
  ),
  rest.get(`${baseURL}/game-room/${123}`, (req, res, ctx) => {
    const response: GameRoom = {
      ...defaultGameRoom,
      id: "123",
      players: [
        { id: "1", username: "Player 1" },
        { id: "2", username: "Player 2" },
      ],
      title: "Test Game Room",
    };
    return res(ctx.json(response));
  }),
  rest.get(`${baseURL}/game-room/${123}/game`, (req, res, ctx) => {
    const response: GameDTO = {
      id: "55",
      activePlayerId: "1",
      players: [
        { playerId: "1", ownShips: [defaultSquare], attacks: [defaultSquare] },
        { playerId: "2", ownShips: [defaultSquare], attacks: [defaultSquare] },
      ],
      state: GameState.UNKNOWN,
      winnerPlayerId: "",
      primaryBoard: {},
      trackingBoard: {},
      gameRoom: "123",
    };
    return res(ctx.json(response));
  }),

  rest.post(`${baseURL}/game/attack`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];

export const server = setupServer(...handlers);
