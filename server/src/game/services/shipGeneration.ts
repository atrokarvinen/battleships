import { FleetShip, Point, Ship } from "../models";
import { generateEmptyBoardPoints, pointsEqual } from "./board-utils";
import { standardReserve } from "./ship-reserve";

export type ShipPlacement = {
  takenPoints: Point[];
  ship: FleetShip;
  start: Point;
  end: Point;
  isVertical: boolean;
};

const isValidPlacement = (freePoints: Point[], shipPoints: Point[]) => {
  const allValid = shipPoints.every((bp) =>
    freePoints.some((fp) => fp.x === bp.x && fp.y == bp.y)
  );
  return allValid;
};

export const createRandomFleetLocations = () => {
  const points = generateEmptyBoardPoints(10);
  let availablePoints = [...points];

  const allShips = standardReserve.fleets
    .map((ship) => {
      const shipClass = ship.class;
      const qty = ship.quantity;
      return Array.from(Array(qty)).map(() => shipClass);
    })
    .flat();

  const ships: Ship[] = [];
  const placements: ShipPlacement[] = allShips.map((ship, index) => {
    const shipSize = ship.size;

    const maxIter = 1000;
    let iter = 0;
    let isValid = false;
    let takenPoints: Point[] = [];
    let start: Point = { x: 0, y: 0 };
    let end: Point = { x: 0, y: 0 };
    let isVertical = true;
    while (!isValid && iter < maxIter) {
      const startX = Math.round(Math.random() * 10);
      const startY = Math.round(Math.random() * 10);

      isVertical = Math.random() < 0.5;

      const endX = isVertical ? startX : startX + shipSize - 1;
      const endY = !isVertical ? startY : startY + shipSize - 1;

      start = { x: startX, y: startY };
      end = { x: endX, y: endY };

      const xPoints = arrayRange(startX, endX);
      const yPoints = arrayRange(startY, endY);
      takenPoints = xPoints
        .map((x) =>
          yPoints.map((y) => ({
            x,
            y,
          }))
        )
        .flat();

      isValid = isValidPlacement(availablePoints, takenPoints);
      iter++;
    }

    if (iter === maxIter) {
      throw new Error("Could not place all ships");
    }
    // console.log("available points: " + availablePoints.length);

    // console.log(
    //   `Placed ship '${ship.name}' #${index + 1} to ${JSON.stringify(
    //     takenPoints
    //   )} after (${iter}) iterations`
    // );

    takenPoints.forEach((tp) => {
      const neighborPoints = [
        { x: tp.x - 1, y: tp.y },
        { x: tp.x + 1, y: tp.y },
        { x: tp.x, y: tp.y - 1 },
        { x: tp.x, y: tp.y + 1 },
      ];
      availablePoints = availablePoints.filter((ap) => {
        const isNeighbor = neighborPoints.some((np) => pointsEqual(ap, np));
        const isSame = pointsEqual(ap, tp);
        return !(isNeighbor || isSame);
      });
    });

    const placement: ShipPlacement = {
      takenPoints,
      ship,
      start,
      end,
      isVertical,
    };
    const createdShip: Ship = {
      start,
      isVertical,
      length: shipSize,
    };
    ships.push(createdShip);
    return placement;
  });

  // return placements;
  return ships;
};

export const getPointRange = (p0: Point, p1: Point) => {
  const xMin = Math.min(p0.x, p1.x);
  const xMax = Math.max(p0.x, p1.x);
  const yMin = Math.min(p0.y, p1.y);
  const yMax = Math.max(p0.y, p1.y);

  const xRange = arrayRange(xMin, xMax);
  const yRange = arrayRange(yMin, yMax);

  const points = xRange.map((x) => yRange.map((y) => ({ x, y }))).flat();
  return points;
};

const arrayRange = (start: number, stop: number) =>
  Array.from({ length: stop - start + 1 }, (value, index) => start + index);
