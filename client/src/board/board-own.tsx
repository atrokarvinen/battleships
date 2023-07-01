import { useAppSelector } from "../redux/hooks";
import { selectPoints } from "../redux/selectors";
import Cell from "./cell";
import { StaticCells } from "./staticCells";
import styles from "./styles.module.scss";

type BoardProps = {
  gameId: string;
  playerId: string;
};

const BoardOwn = ({ gameId, playerId }: BoardProps) => {
  const points = useAppSelector((state) => selectPoints(state, playerId));

  const cellClicked = () => {
    console.log("clicked own board. nothing happens");
  };

  return (
    <div data-testid="own-board" className={styles.board}>
      <StaticCells />
      <div className={styles.playArea}>
        {points.map((point, index) => (
          <Cell key={index} cellClicked={cellClicked} {...point} />
        ))}
      </div>
    </div>
  );
};

export default BoardOwn;
