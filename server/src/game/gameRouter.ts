import { Router } from "express";
import { Server } from "socket.io";
import { GameController } from "./gameController";

export const gameRouter = (io: Server) => {
  const router = Router();

  const controller = new GameController(io);

  router.get("/game-room/:gameRoomId", (req, res, next) =>
    controller.getGame(req, res, next)
  );

  router.post("/start", (req, res, next) =>
    controller.startGame(req, res, next)
  );
  router.post("/end", controller.endGame);
  router.post("/reset", (req, res, next) =>
    controller.resetGame(req, res, next)
  );
  router.post("/attack", (req, res, next) =>
    controller.attackSquare(req, res, next)
  );

  return router;
};
