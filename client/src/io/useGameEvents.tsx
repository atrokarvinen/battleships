import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { mapGameDtoToActiveGame } from "../game/api";
import { GameDTO } from "../game/apiModel";
import {
  missShip,
  openGameOverDialog,
  setActiveGame,
  setIsGameOver,
  setWinnerPlayerId,
  sinkShip,
  swapPlayerIdToPlay,
} from "../redux/activeGameSlice";
import { useAppDispatch } from "../redux/hooks";

export const useGameEvents = (socket: Socket) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    unSubscribeEvents();
    subscribeEvents();
    return () => {
      unSubscribeEvents();
    };
  }, []);

  const subscribeEvents = () => {
    socket.on("gameStarted", (game) => {
      console.log("[Socket client] game started:", game);
      const startedGame: GameDTO = game;
      const activeGame = mapGameDtoToActiveGame(startedGame);
      dispatch(setActiveGame(activeGame));
    });
    socket.on("squareAttacked", (attackResult) => {
      console.log("[Socket client] square attacked:", attackResult);
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
    });
  };

  const unSubscribeEvents = () => {
    socket.off("gameStarted");
    socket.off("squareAttacked");
  };
};
