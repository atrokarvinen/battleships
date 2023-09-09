import { rest } from "msw";
import { setupServer } from "msw/node";
import { config } from "../config/config";

const baseURL = config.backendBaseUrl;

export const handlers = [
  rest.post(`${baseURL}/auth/sign-in`, async (req, res, ctx) => {
    const { username } = await req.json();
    if (username === "shall not pass") {
      return res(ctx.status(400));
    }
    return res(
      ctx.json({
        userId: "1",
        username,
        gamesJoined: [],
      })
    );
  }),
];

export const server = setupServer(...handlers);
