import { Board, Point, ShipPart, Square } from "../models";

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

export const createEmptyBoardSquares = (boardSize: number) => {
  const points = generateEmptyBoardPoints(boardSize);
  const squares: Square[] = points.map((point) => {
    const square: Square = {
      ship: ShipPart.UNKNOWN,
      hasBeenAttacked: false,
      hasShip: false,
      isVertical: false,
      point,
    };
    return square;
  });
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
