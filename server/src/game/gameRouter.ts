import { Router } from "express";
import { Server } from "socket.io";
import { GameController } from "./gameController";

export const gameRouter = (io: Server) => {
  const router = Router();

  const ctr = new GameController(io);

  router.post("/start", (req, res, next) => ctr.startGame(req, res, next));
  router.post("/:gameRoomId/confirm-placements", (req, res, next) =>
    ctr.confirmPlacements(req, res, next)
  );

  router.post("/attack", (req, res, next) => ctr.attackSquare(req, res, next));
  router.post("/end", (req, res, next) => ctr.endGame(req, res, next));

  router.post("/reset", (req, res, next) => ctr.resetGame(req, res, next));

  return router;
};
