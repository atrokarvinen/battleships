import { ShipDTO } from "../game/api/apiModel";
import { pointMatches } from "../redux/activeGameSlice";
import { generateEmptyBoardPoints } from "./empty-board-generator";
import { BoardPoint, ShipPart } from "./models";

export const mapShipsToBoardPoint = (ships: ShipDTO[]) => {
  const shipPoints: BoardPoint[] = ships.map(shipToBoardPoint).flat();
  return shipPoints;
};

export const mergePoints = (shipPoints: BoardPoint[]) => {
  // Generate an empty canvas of points. Overwrite points
  // where there is a ship with ship information.
  const emptyPoints = generateEmptyBoardPoints();
  const mergedPoints = emptyPoints.map((defaultPoint) => {
    const shipPoint = shipPoints.find(pointMatches(defaultPoint.point));
    if (!shipPoint) return defaultPoint;
    return shipPoint;
  });
  return mergedPoints;
};

export const shipToBoardPoint = (ship: ShipDTO) => {
  const { start, isVertical, length } = ship;
  const boardPoints = Array.from(Array(length).keys()).map((n) => {
    const shipPart = lengthIndexToShipPart(n, length);
    const boardPoint: BoardPoint = {
      point: {
        x: isVertical ? start.x : start.x + n,
        y: !isVertical ? start.y : start.y + n,
      },
      shipPart: { isVertical, part: shipPart },
    };
    return boardPoint;
  });
  return boardPoints;
};

const lengthIndexToShipPart = (index: number, length: number) => {
  // Ships with length of 1 are sunk enemy ships for which it is
  // still unknown what shape the ship will have.
  if (length === 1) {
    return ShipPart.UNKNOWN;
  }

  return index === 0
    ? ShipPart.START
    : index === length - 1
    ? ShipPart.END
    : ShipPart.MIDDLE;
};
