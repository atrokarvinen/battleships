import { Router } from "express";
import { Server } from "socket.io";
import { TestController } from "./testController";

export const testRouter = (io: Server) => {
  const router = Router();

  const controller = new TestController(io);

  router.delete("/users/:name", controller.deleteUserByName);

  router.delete("/games/:title", controller.deleteGameRoomByTitle);
  router.delete("/games/:title/games", controller.deleteGamesFromGameRoom);

  router.post("/games/player", controller.addPlayerToGame);
  router.post("/games/seed", controller.seedGame);

  return router;
};
