import cn from "classnames";
import { Point } from "../point";
import styles from "./styles.module.scss";

type WaterSquareProps = {
  point: Point;
  guessed: boolean;
  squareClicked(p: Point): void;
};

const WaterSquare = ({ point, squareClicked, guessed }: WaterSquareProps) => {
  const { x, y } = point;
  return (
    <div
      data-testid={`square-${x}-${y}`}
      className={styles.square}
      onClick={() => squareClicked({ x, y })}
    >
      <div
        data-testid={"water-square"}
        className={cn({ [styles.missed]: guessed })}
      />
    </div>
  );
};

export default WaterSquare;
