import { Point } from "./point";
import { Ship } from "./ship";
import { Square } from "./square";

export type Board = {
  playerId: string;

  shipPoints?: Point[];
  attackedPoints?: Point[];
  missedPoints?: Point[];
  destroyedPoints?: Point[];

  ships: Ship[];
  squares: Square[];
};
