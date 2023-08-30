import { Point, Ship } from "../models";

export const shipToPoints = (ship: Ship) => {
  const points = Array.from(Array(ship.length).keys()).map((n) => {
    const { start, isVertical } = ship;
    const point: Point = {
      x: isVertical ? start.x : start.x + n,
      y: !isVertical ? start.y : start.y + n,
    };
    return point;
  });
  return points;
};

export const shipsToPoints = (ships: Ship[]) => {
  const allPoints: Point[] = ships.map(shipToPoints).flat();
  return allPoints;
};
