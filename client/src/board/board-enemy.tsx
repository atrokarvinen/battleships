import { handleError } from "../auth/errorHandling";
import {
  missShip,
  openGameOverDialog,
  setIsGameOver,
  setWinnerPlayerId,
  sinkShip,
  swapPlayerIdToPlay,
} from "../redux/activeGameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectActivePlayerId,
  selectEnemyPoints,
  selectIsGameOver,
} from "../redux/selectors";
import { guessCellRequest } from "./api";
import Cell from "./cell";
import { AttackResult } from "./cell/attack-result";
import { Point } from "./point";
import { StaticCells } from "./staticCells";
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

  console.log("enemy points:", points);

  const cellClicked = async (point: Point) => {
    console.log("cell clicked @" + JSON.stringify(point));
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
    const isAlreadyGuessed =
      targetPoint.attackResult !== undefined &&
      targetPoint.attackResult !== AttackResult.None;
    const isOpponentBoard = true;
    if (!isOpponentBoard) {
      console.log("guess should click opponent board");
      return;
    }
    if (!isPlayersTurn) {
      console.log("incorrect player turn");
      return;
    }
    if (isAlreadyGuessed) {
      console.log(
        "cell already guessed: " + AttackResult[targetPoint.attackResult]
      );
      return;
    }
    if (isGameOver) {
      console.log("game already over, cannot guess");
      return;
    }
    console.log("guessing point:", point);
    try {
      const response = await guessCellRequest({
        point,
        guesserPlayerId: playerId,
        gameId,
      });
      const { hasBoat, isGameOver } = response.data;
      if (hasBoat) {
        dispatch(sinkShip({ point, guesserPlayerId: playerId }));
        console.log("ship sunk, player gets a new turn");
        if (isGameOver) {
          console.log("game over. Winner:", playerId);
          dispatch(setIsGameOver(true));
          dispatch(openGameOverDialog());
          dispatch(setWinnerPlayerId(playerId));
        }
      } else {
        dispatch(missShip({ point, guesserPlayerId: playerId }));
        dispatch(swapPlayerIdToPlay());
        console.log("miss, player turn changes");
      }
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div className={styles.board}>
      <StaticCells />
      <div className={styles.playArea}>
        {points.map((point, index) => (
          <Cell key={index} cellClicked={cellClicked} {...point} />
        ))}
      </div>
    </div>
  );
};

export default BoardEnemy;
