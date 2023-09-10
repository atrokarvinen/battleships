import { ShipDTO } from "../game/api/apiModel";

export const canMoveUp = (ship: ShipDTO) => {
  return ship.start.y !== 0;
};

export const canMoveLeft = (ship: ShipDTO) => {
  return ship.start.x !== 0;
};

export const canMoveRight = (ship: ShipDTO) => {
  return ship.start.x + Number(!ship.isVertical) * (ship.length - 1) !== 9;
};

export const canMoveDown = (ship: ShipDTO) => {
  return ship.start.y + Number(ship.isVertical) * (ship.length - 1) !== 9;
};

export const canRotate = (ship: ShipDTO) => {
  const rotatedShip: ShipDTO = { ...ship, isVertical: !ship.isVertical };
  const rotatedShipEnd = calculateShipEnd(rotatedShip);
  const overboard = rotatedShipEnd.x > 9 || rotatedShipEnd.y > 9;
  return !overboard;
};

const calculateShipEnd = (ship: ShipDTO) => {
  return {
    x: ship.start.x + Number(!ship.isVertical) * (ship.length - 1),
    y: ship.start.y + Number(ship.isVertical) * (ship.length - 1),
  };
};
