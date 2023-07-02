import { useAppSelector } from "../redux/hooks";
import { selectPoints } from "../redux/selectors";
import Square from "./square";
import { StaticSquares } from "./staticSquares";
import styles from "./styles.module.scss";

type PrimaryBoardProps = {
  gameId: string;
  playerId: string;
};

const PrimaryBoard = ({ gameId, playerId }: PrimaryBoardProps) => {
  const points = useAppSelector((state) => selectPoints(state, playerId));

  const squareClicked = () => {
    console.log("clicked primary board. nothing happens");
  };

  return (
    <div data-testid="primary-board" className={styles.board}>
      <StaticSquares />
      <div className={styles.playArea}>
        {points.map((point, index) => (
          <Square key={index} squareClicked={squareClicked} {...point} />
        ))}
      </div>
    </div>
  );
};

export default PrimaryBoard;
