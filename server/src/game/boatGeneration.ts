import { generateEmptyBoardPoints } from "./board-utils";
import { Point } from "./point";
import { Boat, standardReserve } from "./boat-reserve";

export type BoatPlacement = {
  takenPoints: Point[];
  boat: Boat;
  start: Point;
  end: Point;
  isVertical: boolean;
};

const isValidPlacement = (freePoints: Point[], boatPoints: Point[]) => {
  const allValid = boatPoints.every((bp) =>
    freePoints.some((fp) => fp.x === bp.x && fp.y == bp.y)
  );
  return allValid;
};

export const createRandomFleetLocations = () => {
  const points = generateEmptyBoardPoints();
  let availablePoints = [...points];

  const allBoats = standardReserve.fleets
    .map((boat) => {
      const boatClass = boat.class;
      const qty = boat.quantity;
      return Array.from(Array(qty)).map(() => boatClass);
    })
    .flat();

  const placements: BoatPlacement[] = allBoats.map((boat, index) => {
    const boatSize = boat.size;

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

      const endX = isVertical ? startX : startX + boatSize - 1;
      const endY = !isVertical ? startY : startY + boatSize - 1;

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

      const freePoints = availablePoints.map((ap) => ap.point);

      isValid = isValidPlacement(freePoints, takenPoints);
      iter++;
    }

    // console.log("available points: " + availablePoints.length);

    // console.log(
    //   `Placed boat '${boat.name}' #${index + 1} to ${JSON.stringify(
    //     takenPoints
    //   )} after (${iter}) iterations`
    // );

    takenPoints.forEach((p) => {
      availablePoints = availablePoints.filter(
        (ap) => !(ap.point.x === p.x && ap.point.y === p.y)
      );
    });

    const placement: BoatPlacement = {
      takenPoints,
      boat: boat,
      start,
      end,
      isVertical,
    };
    return placement;
  });

  return placements;
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
