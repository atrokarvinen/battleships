import { Router } from "express";
import { TestController } from "./testController";

export const testRouter = () => {
  const router = Router();

  const controller = new TestController();

  router.delete("/users", controller.deleteAllUsers);
  router.delete("/users/:name", controller.deleteUserByName);

  router.delete("/games/:title", controller.deleteGameByTitle);
  router.delete("/games/:title/games", controller.deleteGamesFromGameRoom);

  router.post("/games/seed", controller.seedGame);

  return router;
};
