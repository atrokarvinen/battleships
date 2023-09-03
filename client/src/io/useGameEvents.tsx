import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { mapGameDtoToActiveGame } from "../game/api";
import { GameDTO } from "../game/apiModel";
import {
  attackSquare,
  gameOver,
  setActiveGame,
  setPlayerReady,
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
    socket.on("playerConfirmedPlacements", (playerId) => {
      console.log("[Socket client] player '%s' is ready", playerId);
      dispatch(setPlayerReady(playerId));
    });
    socket.on("gameEnded", (game) => {
      console.log("[Socket client] game ended:", game);
      const resetGame: GameDTO = game;
      const activeGame = mapGameDtoToActiveGame(resetGame);
      dispatch(setActiveGame(activeGame));
      dispatch(gameOver(activeGame.winnerPlayerId || "N/A"));
    });
    socket.on("squareAttacked", (attackResult) => {
      console.log("[Socket client] square attacked:", attackResult);
      const payload = { ...attackResult, isOwnGuess: false };
      dispatch(attackSquare(payload));
    });
  };

  const unSubscribeEvents = () => {
    socket.off("gameStarted");
    socket.off("playerConfirmedPlacements");
    socket.off("gameEnded");
    socket.off("squareAttacked");
  };
};
