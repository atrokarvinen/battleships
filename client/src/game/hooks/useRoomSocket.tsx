import { useContext, useEffect } from "react";
import { SocketContext } from "../../io/socketProvider";

export const useRoomSocket = (gameRoomId: string) => {
  const socket = useContext(SocketContext);
  useEffect(() => {
    socket.emit("joinRoom", gameRoomId);
    return () => {
      socket.emit("leaveRoom", gameRoomId);
    };
  }, [gameRoomId]);
};
