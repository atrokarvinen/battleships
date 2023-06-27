import { Router } from "express";
import { Server } from "socket.io";
import { GameRoomController } from "./gameRoomController";

export const gameRoomRouter = (io: Server) => {
  const router = Router();

  const controller = new GameRoomController(io);

  router.get("/", (req, res, next) => controller.getGameRooms(req, res, next));
  router.get("/:id", (req, res, next) =>
    controller.getGameRoom(req, res, next)
  );

  router.post("/", (req, res, next) =>
    controller.createGameRoom(req, res, next)
  );

  router.delete("/:id", (req, res, next) =>
    controller.deleteGameRoom(req, res, next)
  );
  router.delete("/", (req, res, next) =>
    controller.deleteAllGameRooms(req, res, next)
  );

  router.post("/player/join", (req, res, next) =>
    controller.joinGame(req, res, next)
  );
  router.post("/player/leave", (req, res, next) =>
    controller.leaveGame(req, res, next)
  );

  return router;
};
