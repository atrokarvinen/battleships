import { shipToBoardPoint } from "../game/api";
import { pointMatches } from "../redux/activeGameSlice";
import { useAppSelector } from "../redux/hooks";
import { selectPlayerAttacks, selectPlayerShips } from "../redux/selectors";
import { Point } from "./models";
import PlayBoard from "./playBoard";

type PrimaryBoardProps = {
  ownId: string;
  enemyId: string;
};

const PrimaryBoard = ({ ownId, enemyId }: PrimaryBoardProps) => {
  const enemyAttacks = useAppSelector(selectPlayerAttacks(enemyId));
  const ownShips = useAppSelector(selectPlayerShips(ownId));

  const squareClicked = (point: Point) => {
    console.log("clicked primary board. nothing happens");
    const relativeShip = ownShips.find((s) => {
      const bps = shipToBoardPoint(s);
      const shipPointsContain = bps.some(pointMatches(point));
      return shipPointsContain;
    });
    console.log("relative ship:", relativeShip);
  };

  return (
    <PlayBoard
      datatestId="primary-board"
      playerId={ownId}
      ships={ownShips}
      attacks={enemyAttacks}
      squareClicked={squareClicked}
    />
  );
};

export default PrimaryBoard;
