import bodyParser from "body-parser";
import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import http from "http";
import { Server } from "socket.io";
import { accountRouter } from "./src/account/accountRouter";
import { authMiddleware } from "./src/auth/authMiddleware";
import { authRouter } from "./src/auth/authRouter";
import { env } from "./src/core/env";
import { connectToDb } from "./src/database/db";
import { gameRouter } from "./src/game/gameRouter";
import { gameRoomRouter } from "./src/gameRoom/gameRoomRouter";
import { errorHandleMiddleware } from "./src/middleware/errorHandleMiddleware";
import { logRequestMiddleware } from "./src/middleware/logRequestMiddleware";
import { addListeners } from "./src/socket/socket";
import { testEnvMiddleware } from "./src/testing/testEnvMiddleware";
import { testRouter } from "./src/testing/testRouter";

const app = express();

app.use(cors({ credentials: true, origin: env.CLIENT_ADDRESS }));
app.use(cookieParser());
app.use(bodyParser.json());

const httpServer = http.createServer(app);
const io = new Server(httpServer, { cors: { origin: "*" } });
addListeners(io);

app.use(logRequestMiddleware);

app.use("/auth", authRouter());
app.use("/account", authMiddleware, accountRouter);
app.use("/game-room", gameRoomRouter(io));
app.use("/game", gameRouter(io));
app.use("/test", testEnvMiddleware, testRouter());
app.use((req, res, next) => {
  const { url, method, route } = req;
  console.log(
    `No endpoint matched request [${method}] ${url}, route: ${route}`
  );
  return next();
});

app.use(errorHandleMiddleware);

connectToDb();

httpServer.listen(env.HTTP_PORT, env.HOST_ADDRESS, () => {
  console.log("Startup finished. Listening to port", env.HTTP_PORT);
});
