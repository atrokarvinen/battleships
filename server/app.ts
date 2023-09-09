import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { accountRouter } from "./src/account/accountRouter";
import { authRouter } from "./src/auth/authRouter";
import { cookieRouter } from "./src/cookie/cookieRouter";
import { env } from "./src/core/env";
import { gameRouter } from "./src/game/gameRouter";
import { gameRoomRouter } from "./src/gameRoom/gameRoomRouter";
import { authMiddleware } from "./src/middleware/authMiddleware";
import { errorHandleMiddleware } from "./src/middleware/errorHandleMiddleware";
import { logRequestMiddleware } from "./src/middleware/logRequestMiddleware";
import { socketMiddleware } from "./src/middleware/socketMiddleware";
import { unknownRouteMiddleware } from "./src/middleware/unknownRouteMiddleware";
import { playerRouter } from "./src/player/playerRouter";
import { shipBuilderRouter } from "./src/shipBuilder/shipBuilderRouter";
import { addListeners } from "./src/socket/socket";
import { testEnvMiddleware } from "./src/testing/testEnvMiddleware";
import { testRouter } from "./src/testing/testRouter";

export const app = express();

app.use(cors({ credentials: true, origin: env.CLIENT_ADDRESS }));
app.use(cookieParser());
app.use(bodyParser.json());

export const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
addListeners(io);

app.use(logRequestMiddleware);
app.use(socketMiddleware);

// app.use("/", (req, res, next) => {
//   return res.json({ name: "frodo" });
// });
app.use("/cookie", cookieRouter);
app.use("/auth", authRouter());
app.use("/account", authMiddleware, accountRouter);
app.use("/game-room", authMiddleware, gameRoomRouter(io));
app.use("/game", authMiddleware, gameRouter(io));
app.use("/ship-builder", authMiddleware, shipBuilderRouter(io));
app.use("/player", playerRouter());
app.use("/test", testEnvMiddleware, testRouter(io));

app.use(unknownRouteMiddleware);
app.use(errorHandleMiddleware);
