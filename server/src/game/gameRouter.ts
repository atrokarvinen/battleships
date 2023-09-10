import { Router } from "express";
import { Server } from "socket.io";
import { GameController } from "./gameController";

export const gameRouter = (io: Server) => {
  const router = Router();

  const ctr = new GameController(io);

  router.post("/start", ctr.startGame);
  router.post("/attack", ctr.attackSquare);
  router.post("/end", ctr.endGame);

  router.get("/:gameRoomId/attack/ai", ctr.getAiAttack);

  return router;
};
