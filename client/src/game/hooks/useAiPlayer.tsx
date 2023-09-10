import { useEffect } from "react";
import { useApiRequest } from "../../api/useApiRequest";
import { OpponentType } from "../../lobby/createGameRoom/createGame";
import { attackSquare } from "../../redux/activeGameSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { AttackResultPayload } from "../../redux/models";
import {
  selectActivePlayerId,
  selectGameRoom,
  selectGameState,
  selectPlayersInGameRoom,
  selectUserId,
} from "../../redux/selectors";
import { getAiAttack } from "../api/api";
import { GameState } from "../api/apiModel";

export const useAiPlayer = (gameRoomId: string) => {
  const dispatch = useAppDispatch();

  const { request } = useApiRequest();

  const players = useAppSelector((state) =>
    selectPlayersInGameRoom(state, gameRoomId)
  );
  const playerId = useAppSelector(selectUserId);
  const computerPlayer = players.find((p) => p.id !== playerId);
  const activePlayerId = useAppSelector(selectActivePlayerId);
  const gameRoom = useAppSelector((state) => selectGameRoom(state, gameRoomId));
  const gameState = useAppSelector(selectGameState);

  const isCorrectStateToAttack = gameState === GameState.STARTED;
  const isAgainstComputer = gameRoom?.opponentType === OpponentType.COMPUTER;
  const isComputerTurn =
    !!computerPlayer && computerPlayer.id === activePlayerId;

  useEffect(() => {
    if (isAgainstComputer && isComputerTurn && isCorrectStateToAttack) {
      setTimeout(playAiTurn, 1000);
    }
  }, [isComputerTurn, isAgainstComputer, isCorrectStateToAttack]);

  const playAiTurn = async () => {
    const response = await request(getAiAttack({ gameRoomId }), true);
    if (!response) return;
    const attack: AttackResultPayload = response.data;
    dispatch(attackSquare(attack));
    if (attack.nextPlayerId === computerPlayer?.id) {
      setTimeout(playAiTurn, 1000);
    }
  };
};
