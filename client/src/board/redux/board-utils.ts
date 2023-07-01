import { BoardPoint } from "../board";
import { Point } from "../point";
import { ShipPart } from "../square-ship-part";
import { AttackResult } from "../square/attack-result";

const boardSize = 10;
const arr = Array.from(Array(boardSize)).map((_, index) => index);
export const generateEmptyBoardPoints = (): BoardPoint[] => {
  return arr
    .map((y) =>
      arr.map((x) => {
        return { x, y };
      })
    )
    .flat()
    .map((p) => {
      return {
        hasShip: false,
        shipPart: ShipPart.None,
        point: { x: p.x, y: p.y },
        attackResult: AttackResult.None,
        defendResult: AttackResult.None,
      };
    });
};

export function determineShipPart(
  currentPoint: Point,
  start: Point,
  end: Point,
  isVertical: boolean
): ShipPart {
  const isStart = currentPoint.x === start.x && currentPoint.y === start.y;
  const isEnd = currentPoint.x === end.x && currentPoint.y === end.y;
  if (isStart) {
    return isVertical ? ShipPart.StartVertical : ShipPart.StartHorizontal;
  } else if (isEnd) {
    return isVertical ? ShipPart.EndVertical : ShipPart.EndHorizontal;
  } else {
    return isVertical ? ShipPart.MiddleVertical : ShipPart.MiddleHorizontal;
  }
}
