import { pointMatches } from "../redux/activeGameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectPlayerAttacks,
  selectPlayerShips,
  selectShipBuilderActive,
} from "../redux/selectors";
import { setSelectedShip } from "../ship-builder/redux/shipBuilderSlice";
import { Point } from "./models";
import PlayBoard from "./playBoard";
import { shipToBoardPoint } from "./ship-to-square-mapper";

type PrimaryBoardProps = {
  ownId: string;
  enemyId: string;
};

const PrimaryBoard = ({ ownId, enemyId }: PrimaryBoardProps) => {
  const dispatch = useAppDispatch();

  const isShipBuilderActive = useAppSelector(selectShipBuilderActive);

  const enemyAttacks = useAppSelector(selectPlayerAttacks(enemyId));
  const ownShips = useAppSelector(selectPlayerShips(ownId));

  const squareClicked = (point: Point) => {
    const relativeShip = ownShips.find((s) => {
      const bps = shipToBoardPoint(s);
      const shipPointsContain = bps.some(pointMatches(point));
      return shipPointsContain;
    });

    if (isShipBuilderActive) {
      dispatch(setSelectedShip(relativeShip));
    }
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
