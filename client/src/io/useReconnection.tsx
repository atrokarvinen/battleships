import { useEffect } from "react";
import { Socket } from "socket.io-client";
import { initialState as gameInitialState } from "../redux/activeGameSlice";
import { useAppSelector } from "../redux/hooks";
import { selectActiveGame } from "../redux/selectors";

// Rejoin to rooms on reconnection
export const useReconnection = (socket: Socket) => {
  const gameRoomId = useAppSelector(selectActiveGame).gameRoomId;

  useEffect(() => {
    socket.io.on("reconnect", onReconnected);
    return () => {
      socket.io.off("reconnect", onReconnected);
    };
  }, []);

  const onReconnected = () => {
    console.log("socket reconnected. rejoining room %s ...", gameRoomId);
    if (gameRoomId !== gameInitialState.gameRoomId) {
      console.log("rejoining room %s", gameRoomId);
      socket.emit("joinRoom", gameRoomId);
    }
  };
};
