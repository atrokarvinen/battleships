import cn from "classnames";
import { Point } from "../point";
import styles from "./styles.module.scss";

type EnemyShipProps = { point: Point };

const EnemyShipSquare = ({ point: { x, y } }: EnemyShipProps) => {
  return (
    <div data-testid={`square-${x}-${y}`} className={styles.square}>
      <div data-testid={"ship-square"} className={cn(styles.ship)} />
    </div>
  );
};

export default EnemyShipSquare;
