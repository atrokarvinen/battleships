import { useEffect } from "react";
import { Socket } from "socket.io-client";
import {
  addNewGameRoom,
  deleteGameRoom,
  joinGame,
  leaveGame,
} from "../redux/gameRoomSlice";
import { useAppDispatch } from "../redux/hooks";
import { addPlayerToGame, removePlayerFromGame } from "../redux/playerSlice";
import { GamePlayerChangedPayload } from "./models";

export const useGameRoomEvents = (socket: Socket) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    unSubscribeEvents();
    subscribeEvents();
    return () => {
      unSubscribeEvents();
    };
  }, []);

  const subscribeEvents = () => {
    socket.on("gameCreated", (game) => {
      console.log(`Game ${JSON.stringify(game)} created`);
      dispatch(addNewGameRoom(game));
    });
    socket.on("gameDeleted", (gameId) => {
      console.log(`Game '${gameId}' deleted`);
      dispatch(deleteGameRoom(gameId));
    });
    socket.on("gameJoined", (payload: GamePlayerChangedPayload) => {
      const { gameId, playerId } = payload;
      console.log(`Player ${playerId} joined game ${gameId}`);
      dispatch(joinGame(payload));
      dispatch(addPlayerToGame(payload));
    });
    socket.on("gameLeft", (payload: GamePlayerChangedPayload) => {
      const { gameId, playerId } = payload;
      console.log(`Player ${playerId} left game ${gameId}`);
      dispatch(leaveGame(payload));
      dispatch(removePlayerFromGame(payload));
    });
  };

  const unSubscribeEvents = () => {
    socket.off("gameCreated");
    socket.off("gameDeleted");
    socket.off("gameJoined");
    socket.off("gameLeft");
  };
};
