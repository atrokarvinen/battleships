import { FleetShip } from "./fleetShip";
import { Point } from "./point";
import { Square } from "./square";

export type Board = {
  playerId: string;

  shipPoints?: Point[];
  attackedPoints?: Point[];
  missedPoints?: Point[];
  destroyedPoints?: Point[];

  ships: FleetShip[];
  squares: Square[];
};
