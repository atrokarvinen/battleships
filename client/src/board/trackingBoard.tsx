import { useApiRequest } from "../api/useApiRequest";
import { attackSquare } from "../redux/activeGameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectActivePlayerId,
  selectEnemyPoints,
  selectIsGameOver,
} from "../redux/selectors";
import { attackSquareRequest } from "./api";
import { BoardPoint } from "./models";
import { AttackResult } from "./models/attack-result";
import { Point } from "./models/point";
import { PlaySquare } from "./square/playSquare";
import { StaticSquares } from "./square/staticSquares";
import styles from "./styles.module.scss";

type TrackingBoardProps = {
  gameId: string;
  playerId: string;
};

const TrackingBoard = ({ gameId, playerId }: TrackingBoardProps) => {
  const dispatch = useAppDispatch();
  const { request } = useApiRequest();
  const points = useAppSelector((state) => selectEnemyPoints(state, playerId));
  const playerIdToPlay = useAppSelector(selectActivePlayerId);
  const isGameOver = useAppSelector(selectIsGameOver);

  const squareClicked = async (point: Point) => {
    console.log("square clicked:", point);
    const targetPoint = points.find(
      (p) => p.point.x === point.x && p.point.y === point.y
    );
    try {
      validateAttack(targetPoint);
    } catch (error: any) {
      console.log(error.message);
      return;
    }
    console.log("attacking point:", point);
    const response = await request(
      attackSquareRequest({
        point,
        attackerPlayerId: playerId,
        gameId,
      }),
      true
    );
    if (!response) return;
    const payload = { ...response.data, isOwnGuess: true };
    dispatch(attackSquare(payload));
  };

  const validateAttack = (targetPoint: BoardPoint | undefined) => {
    if (!targetPoint) {
      throw new Error("failed to find point");
    }
    const isPlayersTurn = playerIdToPlay === playerId;
    const isAlreadyAttacked =
      targetPoint.attackResult !== undefined &&
      targetPoint.attackResult !== AttackResult.None;
    if (!isPlayersTurn) {
      throw new Error("incorrect player turn");
    }
    if (isAlreadyAttacked) {
      throw new Error("square already attacked");
    }
    if (isGameOver) {
      throw new Error("game already over, cannot attack");
    }
  };

  return (
    <div className={styles.board} data-testid="tracking-board">
      <StaticSquares />
      <div className={styles.playArea}>
        {points.map((point, index) => (
          <PlaySquare key={index} squareClicked={squareClicked} {...point} />
        ))}
      </div>
    </div>
  );
};

export default TrackingBoard;
