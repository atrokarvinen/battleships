import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { mapGameDtoToActiveGame } from "../game/api";
import { GameDTO } from "../game/apiModel";
import { attackSquare, setActiveGame } from "../redux/activeGameSlice";
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
      dispatch(attackSquare(attackResult));
    });
  };

  const unSubscribeEvents = () => {
    socket.off("gameStarted");
    socket.off("squareAttacked");
  };
};
