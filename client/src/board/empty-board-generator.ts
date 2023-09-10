import { AttackResult } from "./models/attack-result";
import { BoardPoint } from "./models/boardPoint";

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
        shipPart: undefined,
        point: { x: p.x, y: p.y },
        attackResult: AttackResult.None,
        defendResult: AttackResult.None,
      };
    });
};
