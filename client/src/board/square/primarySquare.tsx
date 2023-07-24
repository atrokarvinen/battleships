import cn from "classnames";
import { Point } from "../point";
import { ShipPart } from "../square-ship-part";
import { AttackResult } from "./attack-result";
import styles from "./styles.module.scss";

type PrimarySquareProps = {
  point: Point;
  shipPart: ShipPart;

  attackResult: AttackResult;

  squareClicked(p: Point): void;
};

const PrimarySquare = ({
  point: { x, y },
  shipPart,
  squareClicked,
  attackResult,
}: PrimarySquareProps) => {
  const hasShip = shipPart !== ShipPart.Unknown && shipPart !== ShipPart.None;

  const getShipPartClassName = (shipPart: ShipPart) => {
    switch (shipPart) {
      case ShipPart.StartHorizontal:
        return styles.shipStartHorizontal;
      case ShipPart.MiddleHorizontal:
        return styles.shipMiddleHorizontal;
      case ShipPart.EndHorizontal:
        return styles.shipEndHorizontal;
      case ShipPart.StartVertical:
        return styles.shipStartVertical;
      case ShipPart.MiddleVertical:
        return styles.shipMiddleVertical;
      case ShipPart.EndVertical:
        return styles.shipEndVertical;
      case ShipPart.EnemyExplosion:
        return styles.enemyExplosion;
      default:
        return "";
    }
  };

  return (
    <div
      data-testid={`square-${x}-${y}`}
      className={styles.square}
      onClick={() => squareClicked({ x, y })}
    >
      <div
        data-testid={hasShip ? "ship-square" : "water-square"}
        className={cn(getShipPartClassName(shipPart), {
          [styles.ship]: hasShip,
          [styles.attacked]: attackResult === AttackResult.Hit,
          [styles.missed]: attackResult === AttackResult.Miss,
        })}
      />
    </div>
  );
};

export default PrimarySquare;
