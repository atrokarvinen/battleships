import { Point } from "../models";

export const generateEmptyBoardPoints = (boardSize: number): Point[] => {
  const arr = Array.from(Array(boardSize)).map((_, index) => index);
  return arr
    .map((y) =>
      arr.map((x) => {
        return { x, y };
      })
    )
    .flat();
};

export const pointsEqual = (pointA: Point) => (pointB: Point) => {
  return pointA.x === pointB.x && pointA.y === pointB.y;
};
