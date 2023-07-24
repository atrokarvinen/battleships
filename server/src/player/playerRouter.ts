import { Router } from "express";
import { PlayerController } from "./playerController";

export const playerRouter = () => {
  const router = Router();

  const controller = new PlayerController();

  router.get("/", controller.getPlayers);

  return router;
};
