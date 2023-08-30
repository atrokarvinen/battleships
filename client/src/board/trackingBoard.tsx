import { useApiRequest } from "../api/useApiRequest";
import { attackSquare, pointMatchesToPoint } from "../redux/activeGameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectActivePlayerId,
  selectIsGameOver,
  selectPlayerAttacks,
  selectPlayerShips,
} from "../redux/selectors";
import { attackSquareRequest } from "./api";
import { Point } from "./models/point";
import PlayBoard from "./playBoard";

type TrackingBoardProps = {
  gameId: string;
  ownId: string;
  enemyId: string;
};

const TrackingBoard = ({ gameId, ownId, enemyId }: TrackingBoardProps) => {
  const dispatch = useAppDispatch();
  const { request } = useApiRequest();
  const playerIdToPlay = useAppSelector(selectActivePlayerId);
  const isGameOver = useAppSelector(selectIsGameOver);

  const enemyShips = useAppSelector(selectPlayerShips(enemyId));
  const ownAttacks = useAppSelector(selectPlayerAttacks(ownId));

  const squareClicked = async (point: Point) => {
    console.log("square clicked:", point);
    try {
      validateAttack(point);
    } catch (error: any) {
      console.log(error.message);
      return;
    }
    console.log("attacking point:", point);
    const response = await request(
      attackSquareRequest({
        point,
        attackerPlayerId: ownId,
        gameId,
      }),
      true
    );
    if (!response) return;
    const payload = { ...response.data, isOwnGuess: true };
    dispatch(attackSquare(payload));
  };

  const validateAttack = (targetPoint: Point) => {
    const isPlayersTurn = playerIdToPlay === ownId;
    const isAlreadyAttacked = ownAttacks.some(pointMatchesToPoint(targetPoint));
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
    <PlayBoard
      datatestId="tracking-board"
      playerId={enemyId}
      ships={enemyShips}
      attacks={ownAttacks}
      squareClicked={squareClicked}
    />
  );
};

export default TrackingBoard;
