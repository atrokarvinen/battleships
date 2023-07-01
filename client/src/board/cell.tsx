import cn from "classnames";
import { BoatPart } from "./cell-boat-part";
import { AttackResult } from "./cell/attack-result";
import { Point } from "./point";
import styles from "./styles.module.scss";

type CellProps = {
  point: Point;
  boatPart: BoatPart;

  attackResult: AttackResult;
  defendResult: AttackResult;

  cellClicked(p: Point): void;
};

const Cell = ({
  point: { x, y },
  boatPart,
  cellClicked,
  attackResult,
  defendResult,
}: CellProps) => {
  const hasBoat = boatPart !== BoatPart.Unknown && boatPart !== BoatPart.None;
  return (
    <div
      data-testid={`square-${x}-${y}`}
      className={styles.cell}
      onClick={() => cellClicked({ x, y })}
    >
      <div
        data-testid={hasBoat ? "ship-square" : "water-square"}
        className={cn({
          [styles.boat]: hasBoat,
          [styles.boatStartHorizontal]: boatPart === BoatPart.StartHorizontal,
          [styles.boatMiddleHorizontal]: boatPart === BoatPart.MiddleHorizontal,
          [styles.boatEndHorizontal]: boatPart === BoatPart.EndHorizontal,
          [styles.boatStartVertical]: boatPart === BoatPart.StartVertical,
          [styles.boatMiddleVertical]: boatPart === BoatPart.MiddleVertical,
          [styles.boatEndVertical]: boatPart === BoatPart.EndVertical,
          [styles.attacked]: attackResult === AttackResult.Hit,
          [styles.missed]: attackResult === AttackResult.Miss,
          [styles.sunk]: defendResult === AttackResult.Hit,
          [styles.defendMiss]: defendResult === AttackResult.Miss,
        })}
      >
        {/* {`(${x}, ${y})`} */}
      </div>
    </div>
  );
};

export default Cell;
