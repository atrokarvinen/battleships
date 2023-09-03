import {
  mapShipsToBoardPoint,
  mergePoints,
  shipToBoardPoint,
} from "../game/api";
import { ShipDTO } from "../game/apiModel";
import { pointMatches, pointMatchesToPoint } from "../redux/activeGameSlice";
import { useAppSelector } from "../redux/hooks";
import {
  selectSelectedShip,
  selectShipBuilderActive,
} from "../redux/selectors";
import { AttackResult, Point } from "./models";
import { PlaySquare } from "./square/playSquare";
import { StaticSquares } from "./square/staticSquares";
import styles from "./styles.module.scss";

type PlayBoardProps = {
  playerId: string;
  ships: ShipDTO[];
  attacks: Point[];
  squareClicked(point: Point): void;
  datatestId: string;
};

const PlayBoard = ({
  playerId,
  ships,
  attacks,
  squareClicked,
  datatestId,
}: PlayBoardProps) => {
  const lastAttack = useAppSelector((state) => state.activeGame.lastAttack);
  const selectedShip = useAppSelector(selectSelectedShip);
  const isShipBuilderActive = useAppSelector(selectShipBuilderActive);

  const shipPoints = mapShipsToBoardPoint(ships);
  const boardPoints = mergePoints(shipPoints);

  const isSquareLastAttacked = (point: Point) => {
    const lastAttacked =
      !!lastAttack &&
      lastAttack.playerId !== playerId &&
      lastAttack.point.x === point.x &&
      lastAttack.point.y === point.y;
    return lastAttacked;
  };

  const determineAttackResult = (point: Point) => {
    const hasBeenAttacked = attacks.some(pointMatchesToPoint(point));
    const hasShip = shipPoints.some(pointMatches(point));
    if (hasShip) {
      if (hasBeenAttacked) {
        return AttackResult.Hit;
      }
    } else {
      if (hasBeenAttacked) {
        return AttackResult.Miss;
      }
    }
    return AttackResult.None;
  };

  const isSquareSelectedForShipBuilder = (point: Point) => {
    if (!selectedShip || !isShipBuilderActive) {
      return false;
    }

    const selectedSquares = shipToBoardPoint(selectedShip);
    return selectedSquares.some(pointMatches(point));
  };

  return (
    <div data-testid={datatestId} className={styles.board}>
      <StaticSquares />
      <div className={styles.playArea}>
        {boardPoints.map((bp, index) => {
          const point = bp.point;
          const lastAttacked = isSquareLastAttacked(point);
          const attackResult = determineAttackResult(point);
          const isSelectedForBuilder = isSquareSelectedForShipBuilder(point);
          return (
            <PlaySquare
              key={index}
              attackResult={attackResult}
              isSelectedForBuilder={isSelectedForBuilder}
              lastAttacked={lastAttacked}
              point={point}
              squareClicked={squareClicked}
              shipPart={bp.shipPart}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PlayBoard;
