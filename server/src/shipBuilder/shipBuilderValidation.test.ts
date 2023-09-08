import { Point, Ship } from "../game/models";
import { standardReserve } from "../game/services/ship-reserve";
import { defaultShip } from "../testing/defaults/defaultShip";
import { ShipBuilderValidator } from "./shipBuilderValidation";

const validator = new ShipBuilderValidator();

it("all ships are placed", () => {
  const fleets = standardReserve.fleets;
  const allShips = fleets
    .map((f) => {
      return Array.from(Array(f.quantity).keys()).map(() => {
        const ship: Ship = { ...defaultShip, length: f.class.size };
        return ship;
      });
    })
    .flat();

  const allPlaced = validator.areAllShipsPlaced(allShips);

  expect(allPlaced).toBeTruthy();
});

it("all ships are not placed", () => {
  const ships: Ship[] = [];

  const allPlaced = validator.areAllShipsPlaced(ships);

  expect(allPlaced).toBeFalsy();
});

it("points are inside borders", () => {
  const points: Point[] = [
    { x: 0, y: 0 },
    { x: 5, y: 5 },
    { x: 9, y: 9 },
  ];

  const result = validator.arePointsInsideBorders(points);

  expect(result).toBeTruthy();
});

it.each<Point>([
  { x: 10, y: 0 },
  { x: 0, y: 10 },
  { x: -5, y: 5 },
  { x: 5, y: -5 },
])("points [%s] are not inside valid borders", (point: Point) => {
  const points: Point[] = [point];

  const result = validator.arePointsInsideBorders(points);

  expect(result).toBeFalsy();
});

it("has no adjacent ships", () => {
  const playerShips: Ship[] = [
    { isVertical: false, length: 3, start: { x: 0, y: 0 } },
    { isVertical: false, length: 3, start: { x: 3, y: 1 } },
    { isVertical: true, length: 3, start: { x: 5, y: 5 } },
  ];

  const result = validator.hasAdjacentShips(playerShips);

  expect(result).toBeFalsy();
});

it("has adjacent ships", () => {
  const playerShips: Ship[] = [
    { isVertical: false, length: 3, start: { x: 0, y: 0 } },
    { isVertical: false, length: 3, start: { x: 1, y: 1 } },
  ];

  const result = validator.hasAdjacentShips(playerShips);

  expect(result).toBeTruthy();
});

it("has no duplicate points", () => {
  const points = [
    { x: 0, y: 0 },
    { x: 0, y: 1 },
    { x: 1, y: 0 },
    { x: 1, y: 1 },
  ];

  const result = validator.hasDuplicates(points);

  expect(result).toBeFalsy();
});

it("has duplicate points", () => {
  const points = [
    { x: 1, y: 1 },
    { x: 1, y: 1 },
  ];

  const result = validator.hasDuplicates(points);

  expect(result).toBeTruthy();
});