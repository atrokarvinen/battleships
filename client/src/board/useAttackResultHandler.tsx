import {
  missShip,
  openGameOverDialog,
  setIsGameOver,
  setWinnerPlayerId,
  sinkShip,
  swapPlayerIdToPlay,
} from "../redux/activeGameSlice";
import { useAppDispatch } from "../redux/hooks";

export const useAttackResultHandler = () => {
  const dispatch = useAppDispatch();

  const handleAttack = (attackResult: any) => {
    const { hasShip, isGameOver, point, playerId } = attackResult;
    if (hasShip) {
      dispatch(sinkShip({ point, attackerPlayerId: playerId }));
      console.log("ship sunk, player gets a new turn");
      if (isGameOver) {
        console.log("game over. Winner:", playerId);
        dispatch(setIsGameOver(true));
        dispatch(openGameOverDialog());
        dispatch(setWinnerPlayerId(playerId));
      }
    } else {
      dispatch(missShip({ point, attackerPlayerId: playerId }));
      dispatch(swapPlayerIdToPlay());
      console.log("miss, player turn changes");
    }
  };

  return { handleAttack };
};
