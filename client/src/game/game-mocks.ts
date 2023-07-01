import { rest } from "msw";
import { setupServer } from "msw/node";
import { config } from "../config/config";
import { GameRoom } from "../lobby/gameRoom";
import { GameDTO, GameState } from "./apiModel";
import { defaultCell } from "./defaults";

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
      id: "123",
      players: [
        { id: "1", username: "Player 1", gamesJoined: [] },
        { id: "2", username: "Player 2", gamesJoined: [] },
      ],
      title: "Test Game Room",
    };
    return res(ctx.json(response));
  }),
  rest.get(`${baseURL}/game/game-room/${123}`, (req, res, ctx) => {
    const response: GameDTO = {
      id: "55",
      activePlayerId: "1",
      playerIds: ["1", "2"],
      playerInfos: [
        { playerId: "1", ownShips: [defaultCell], guesses: [defaultCell] },
        { playerId: "2", ownShips: [defaultCell], guesses: [defaultCell] },
      ],
      state: GameState.UNKNOWN,
      winnerId: "",
    };
    return res(ctx.json({ game: response }));
  }),

  rest.post(`${baseURL}/game/guess`, (req, res, ctx) => {
    return res(ctx.status(200));
  }),
];

export const server = setupServer(...handlers);
