import { Router } from "express";
import { Server } from "socket.io";
import { ShipBuilderController } from "./shipBuilderController";

export const shipBuilderRouter = (io: Server) => {
  const router = Router();

  const ctr = new ShipBuilderController(io);

  router.put("/ship/:id", ctr.transformShip);
  router.post("/confirm", ctr.confirmPlacements);

  return router;
};
