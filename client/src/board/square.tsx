import cn from "classnames";
import { Point } from "./point";
import { ShipPart } from "./square-ship-part";
import { AttackResult } from "./square/attack-result";
import styles from "./styles.module.scss";

type SquareProps = {
  point: Point;
  shipPart: ShipPart;

  attackResult: AttackResult;
  defendResult: AttackResult;

  squareClicked(p: Point): void;
};

const Square = ({
  point: { x, y },
  shipPart,
  squareClicked,
  attackResult,
  defendResult,
}: SquareProps) => {
  const hasShip = shipPart !== ShipPart.Unknown && shipPart !== ShipPart.None;
  return (
    <div
      data-testid={`square-${x}-${y}`}
      className={styles.square}
      onClick={() => squareClicked({ x, y })}
    >
      <div
        data-testid={hasShip ? "ship-square" : "water-square"}
        className={cn({
          [styles.ship]: hasShip,
          [styles.shipStartHorizontal]: shipPart === ShipPart.StartHorizontal,
          [styles.shipMiddleHorizontal]: shipPart === ShipPart.MiddleHorizontal,
          [styles.shipEndHorizontal]: shipPart === ShipPart.EndHorizontal,
          [styles.shipStartVertical]: shipPart === ShipPart.StartVertical,
          [styles.shipMiddleVertical]: shipPart === ShipPart.MiddleVertical,
          [styles.shipEndVertical]: shipPart === ShipPart.EndVertical,
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

export default Square;
