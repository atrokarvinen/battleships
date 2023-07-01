import { useAppSelector } from "../redux/hooks";
import { selectPoints } from "../redux/selectors";
import Square from "./square";
import { StaticSquares } from "./staticSquares";
import styles from "./styles.module.scss";

type BoardProps = {
  gameId: string;
  playerId: string;
};

const BoardOwn = ({ gameId, playerId }: BoardProps) => {
  const points = useAppSelector((state) => selectPoints(state, playerId));

  const squareClicked = () => {
    console.log("clicked own board. nothing happens");
  };

  return (
    <div data-testid="own-board" className={styles.board}>
      <StaticSquares />
      <div className={styles.playArea}>
        {points.map((point, index) => (
          <Square key={index} squareClicked={squareClicked} {...point} />
        ))}
      </div>
    </div>
  );
};

export default BoardOwn;
