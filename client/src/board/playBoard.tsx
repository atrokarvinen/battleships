import { mapShipsToBoardPoint, mergePoints } from "../game/api";
import { ShipDTO } from "../game/apiModel";
import { pointMatches, pointMatchesToPoint } from "../redux/activeGameSlice";
import { useAppSelector } from "../redux/hooks";
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

  return (
    <div data-testid={datatestId} className={styles.board}>
      <StaticSquares />
      <div className={styles.playArea}>
        {boardPoints.map((point, index) => {
          const lastAttacked = isSquareLastAttacked(point.point);
          const attackResult = determineAttackResult(point.point);
          return (
            <PlaySquare
              key={index}
              lastAttacked={lastAttacked}
              squareClicked={squareClicked}
              attackResult={attackResult}
              point={point.point}
              shipPart={point.shipPart}
            />
          );
        })}
      </div>
    </div>
  );
};

export default PlayBoard;
