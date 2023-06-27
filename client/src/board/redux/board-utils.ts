import { BoardPoint } from "../board";
import { BoatPart } from "../cell-boat-part";
import { AttackResult } from "../cell/attack-result";
import { Point } from "../point";

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
        hasBoat: false,
        boatPart: BoatPart.None,
        point: { x: p.x, y: p.y },
        attackResult: AttackResult.None,
        defendResult: AttackResult.None,
      };
    });
};

export function determineBoatPart(
  currentPoint: Point,
  start: Point,
  end: Point,
  isVertical: boolean
): BoatPart {
  const isStart = currentPoint.x === start.x && currentPoint.y === start.y;
  const isEnd = currentPoint.x === end.x && currentPoint.y === end.y;
  if (isStart) {
    return isVertical ? BoatPart.StartVertical : BoatPart.StartHorizontal;
  } else if (isEnd) {
    return isVertical ? BoatPart.EndVertical : BoatPart.EndHorizontal;
  } else {
    return isVertical ? BoatPart.MiddleVertical : BoatPart.MiddleHorizontal;
  }
}
