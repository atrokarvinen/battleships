import { Router } from "express";
import { Server } from "socket.io";
import { GameController } from "./gameController";

export const gameRouter = (io: Server) => {
  const router = Router();

  const ctr = new GameController(io);

  router.get("/:gameRoomId/attack/ai", ctr.getAiAttack);

  router.post("/start", ctr.startGame);
  router.post("/attack", ctr.attackSquare);
  router.post("/end", ctr.endGame);

  return router;
};
