import { Board } from "../models/board";
import { Point } from "../models/point";
import { ShipPart } from "../models/shipPart";
import { Square } from "../models/square";

const boardSize = 10;
const arr = Array.from(Array(boardSize)).map((_, index) => index);
export const generateEmptyBoardPoints = (): Point[] => {
  return arr
    .map((y) =>
      arr.map((x) => {
        return { x, y };
      })
    )
    .flat();
};

// TODO identical to above method 'generateEmptyBoardPoints'?
export const createEmptyBoardSquares = (boardSize: number) => {
  const arr = Array.from(Array(boardSize)).map((_, index) => index);
  const squares: Square[] = arr
    .map((row) => {
      return arr.map((column) => {
        const square: Square = {
          ship: ShipPart.UNKNOWN,
          hasBeenAttacked: false,
          hasShip: false,
          isVertical: false,
          point: { x: column, y: row },
        };
        return square;
      });
    })
    .flat();
  return squares;
};

export const createEmptyBoard = (playerId: string) => {
  const boardSize = 10;
  const board: Board = {
    playerId,
    squares: createEmptyBoardSquares(boardSize),
    ships: [],
  };
  return board;
};

export const pointsEqual = (pointA: Point, pointB: Point) => {
  return pointA.x === pointB.x && pointA.y === pointB.y;
};

export const pointEqualsToSquare = (pointA: Point) => (square: Square) => {
  const pointB = square.point;
  return pointsEqual(pointA, pointB);
};
