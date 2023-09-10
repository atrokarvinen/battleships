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
import { PlayerJoinedPayload, PlayerLeftPayload } from "./models";

export const useGameRoomEvents = (socket: Socket) => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    unsubscribeEvents();
    subscribeEvents();
    return () => {
      unsubscribeEvents();
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
    socket.on("gameJoined", (payload: PlayerJoinedPayload) => {
      const { gameId, player } = payload;
      console.log(`Player ${player.username} joined game ${gameId}`);
      dispatch(joinGame(payload));
      dispatch(addPlayerToGame({ gameId, playerId: player.id }));
    });
    socket.on("gameLeft", (payload: PlayerLeftPayload) => {
      const { gameId, playerId } = payload;
      console.log(`Player ${playerId} left game ${gameId}`);
      dispatch(leaveGame(payload));
      dispatch(removePlayerFromGame(payload));
    });
  };

  const unsubscribeEvents = () => {
    socket.off("gameCreated");
    socket.off("gameDeleted");
    socket.off("gameJoined");
    socket.off("gameLeft");
  };
};
