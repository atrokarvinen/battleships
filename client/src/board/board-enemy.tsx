import { handleError } from "../auth/errorHandling";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectActivePlayerId,
  selectEnemyPoints,
  selectIsGameOver,
} from "../redux/selectors";
import { attackSquareRequest } from "./api";
import { Point } from "./point";
import Square from "./square";
import { AttackResult } from "./square/attack-result";
import { StaticSquares } from "./staticSquares";
import styles from "./styles.module.scss";

type BoardProps = {
  gameId: string;
  playerId: string;
};

const BoardEnemy = ({ gameId, playerId }: BoardProps) => {
  const points = useAppSelector((state) => selectEnemyPoints(state, playerId));
  const playerIdToPlay = useAppSelector(selectActivePlayerId);
  const isGameOver = useAppSelector(selectIsGameOver);
  const dispatch = useAppDispatch();

  // console.log("enemy points:", points);

  const squareClicked = async (point: Point) => {
    console.log("square clicked @" + JSON.stringify(point));
    console.log(
      `playerIdToPlay === playerId: ${playerIdToPlay} === ${playerId}`
    );
    const targetPoint = points.find(
      (p) => p.point.x === point.x && p.point.y === point.y
    );
    if (!targetPoint) {
      console.log("failed to find point");
      return;
    }
    const isPlayersTurn = playerIdToPlay === playerId;
    const isAlreadyAttacked =
      targetPoint.attackResult !== undefined &&
      targetPoint.attackResult !== AttackResult.None;
    const isOpponentBoard = true;
    if (!isOpponentBoard) {
      console.log("attack should click opponent board");
      return;
    }
    if (!isPlayersTurn) {
      console.log("incorrect player turn");
      return;
    }
    if (isAlreadyAttacked) {
      console.log(
        "square already attacked: " + AttackResult[targetPoint.attackResult]
      );
      return;
    }
    if (isGameOver) {
      console.log("game already over, cannot attack");
      return;
    }
    console.log("attacking point:", point);
    try {
      const response = await attackSquareRequest({
        point,
        attackerPlayerId: playerId,
        gameId,
      });

      // Response handled in event handler
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className={styles.board} data-testid="enemy-board">
      <StaticSquares />
      <div className={styles.playArea}>
        {points.map((point, index) => (
          <Square key={index} squareClicked={squareClicked} {...point} />
        ))}
      </div>
    </div>
  );
};

export default BoardEnemy;
