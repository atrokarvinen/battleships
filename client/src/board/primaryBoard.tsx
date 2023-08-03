import { useAppSelector } from "../redux/hooks";
import { selectOwnPoints } from "../redux/selectors";
import PrimarySquare from "./square/primarySquare";
import { StaticSquares } from "./square/staticSquares";
import styles from "./styles.module.scss";

type PrimaryBoardProps = {
  playerId: string;
};

const PrimaryBoard = ({ playerId }: PrimaryBoardProps) => {
  const points = useAppSelector((state) => selectOwnPoints(state, playerId));

  const squareClicked = () => {
    console.log("clicked primary board. nothing happens");
  };

  return (
    <div data-testid="primary-board" className={styles.board}>
      <StaticSquares />
      <div className={styles.playArea}>
        {points.map((point, index) => (
          <PrimarySquare key={index} squareClicked={squareClicked} {...point} />
        ))}
      </div>
    </div>
  );
};

export default PrimaryBoard;
