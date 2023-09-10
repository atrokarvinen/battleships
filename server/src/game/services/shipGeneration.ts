import { ShipBuilderValidator } from "../../shipBuilder/shipBuilderValidation";
import { Ship } from "../models";
import { standardReserve } from "./ship-reserve";
import { shipsToPoints } from "./shipToSquareMapper";

export const createRandomFleetLocations = () => {
  const validator = new ShipBuilderValidator();

  const shipsToPlace = standardReserve.fleets
    .map((ship) => {
      const shipClass = ship.class;
      const qty = ship.quantity;
      return Array.from(Array(qty)).map(() => shipClass);
    })
    .flat();

  const ships: Ship[] = [];
  shipsToPlace.forEach((ship) => {
    const maxIter = 1000;
    let iter = 0;
    while (iter < maxIter) {
      const randomShip = generateRandomShip(ship.size);
      const proposedFleet = [...ships, randomShip];
      const shipPoints = shipsToPoints(proposedFleet);
      const noOVerlap = !validator.hasDuplicates(shipPoints);
      const withinBorders = validator.arePointsInsideBorders(shipPoints);
      const noAdjacency = !validator.hasAdjacentShips(proposedFleet);
      const isValid = noOVerlap && withinBorders && noAdjacency;
      if (isValid) {
        ships.push(randomShip);
        break;
      }
      iter++;
    }

    if (iter === maxIter) {
      throw new Error("Could not place all ships");
    }
  });

  return ships;
};

const generateRandomShip = (shipSize: number) => {
  const isVertical = Math.random() < 0.5;
  const startX = Math.round(Math.random() * 10);
  const startY = Math.round(Math.random() * 10);
  const start = { x: startX, y: startY };

  const ship: Ship = { isVertical, length: shipSize, start };
  return ship;
};
