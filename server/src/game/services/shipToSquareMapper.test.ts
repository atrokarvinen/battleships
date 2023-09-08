import { Point, Ship } from "../models";
import { shipToPoints, shipsToPoints } from "./shipToSquareMapper";

it("converts horizontal ship to points", () => {
  const ship: Ship = {
    start: { x: 0, y: 0 },
    isVertical: false,
    length: 3,
  };
  const expectedPoints: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
  ];

  const points = shipToPoints(ship);

  expect(points).toStrictEqual(expectedPoints);
});

it("converts vertical ship to points", () => {
  const ship: Ship = {
    start: { x: 5, y: 3 },
    isVertical: true,
    length: 3,
  };
  const expectedPoints: Point[] = [
    { x: 5, y: 3 },
    { x: 5, y: 4 },
    { x: 5, y: 5 },
  ];

  const points = shipToPoints(ship);

  expect(points).toStrictEqual(expectedPoints);
});

it("converts multiple ships to points", () => {
  const ship1: Ship = {
    start: { x: 0, y: 0 },
    isVertical: false,
    length: 3,
  };
  const ship2: Ship = {
    start: { x: 5, y: 3 },
    isVertical: true,
    length: 3,
  };
  const expectedPoints: Point[] = [
    { x: 0, y: 0 },
    { x: 1, y: 0 },
    { x: 2, y: 0 },
    { x: 5, y: 3 },
    { x: 5, y: 4 },
    { x: 5, y: 5 },
  ];

  const points = shipsToPoints([ship1, ship2]);

  expect(points).toStrictEqual(expectedPoints);
});
