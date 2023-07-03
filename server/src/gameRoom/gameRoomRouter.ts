import { Router } from "express";
import { Server } from "socket.io";
import { GameRoomController } from "./gameRoomController";

export const gameRoomRouter = (io: Server) => {
  const router = Router();

  const ctr = new GameRoomController(io);

  router.get("/", (req, res, next) => ctr.getGameRooms(req, res, next));
  router.get("/:id", (req, res, next) => ctr.getGameRoom(req, res, next));

  router.post("/", (req, res, next) => ctr.createGameRoom(req, res, next));

  router.delete("/:id", (req, res, next) => ctr.deleteGameRoom(req, res, next));

  router.post("/player/join", (req, res, next) => ctr.joinGame(req, res, next));
  router.post("/player/leave", (req, res, next) =>
    ctr.leaveGame(req, res, next)
  );

  return router;
};
