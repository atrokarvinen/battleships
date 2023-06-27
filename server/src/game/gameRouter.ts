import { Router } from "express";
import { GameController } from "./gameController";

export const gameRouter = () => {
  const router = Router();

  const controller = new GameController();

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
  router.post("/guess", (req, res, next) =>
    controller.guessCell(req, res, next)
  );

  return router;
};
