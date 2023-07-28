import { Router } from "express";
import { Server } from "socket.io";
import { validationMiddleware } from "../middleware/validationMiddleware";
import { GameRoomController } from "./gameRoomController";
import { createGameValidation } from "./validation";

export const gameRoomRouter = (io: Server) => {
  const router = Router();

  const ctr = new GameRoomController(io);

  router.get("/", ctr.getGameRooms);
  router.get("/:id", ctr.getGameRoom);
  router.get("/:id/game", ctr.getGameInRoom);

  router.post(
    "/",
    createGameValidation,
    validationMiddleware,
    ctr.createGameRoom
  );

  router.delete("/:id", ctr.deleteGameRoom);

  router.post("/player/join", ctr.joinGame);
  router.post("/player/leave", ctr.leaveGame);

  return router;
};
