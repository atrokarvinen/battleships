import { useAppSelector } from "../redux/hooks";
import { selectOwnPoints } from "../redux/selectors";
import { PlaySquare } from "./square/playSquare";
import { StaticSquares } from "./square/staticSquares";
import styles from "./styles.module.scss";

type PrimaryBoardProps = {
  playerId: string;
};

const PrimaryBoard = ({ playerId }: PrimaryBoardProps) => {
  const lastAttack = useAppSelector((state) => state.activeGame.lastAttack);
  const points = useAppSelector((state) => selectOwnPoints(state, playerId));

  const squareClicked = () => {
    console.log("clicked primary board. nothing happens");
  };

  return (
    <div data-testid="primary-board" className={styles.board}>
      <StaticSquares />
      <div className={styles.playArea}>
        {points.map((point, index) => {
          const lastAttacked =
            !!lastAttack &&
            lastAttack.playerId !== playerId &&
            lastAttack.point.x === point.point.x &&
            lastAttack.point.y === point.point.y;
          return (
            <PlaySquare
              key={index}
              lastAttacked={lastAttacked}
              squareClicked={squareClicked}
              {...point}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PrimaryBoard;
