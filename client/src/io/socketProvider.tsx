import { ReactElement, createContext, useEffect } from "react";
import { io } from "socket.io-client";
import { axios } from "../api/axios";
import { config } from "../config/config";
import { useGameEvents } from "./useGameEvents";
import { useGameRoomEvents } from "./useGameRoomEvents";
import { useReconnection } from "./useReconnection";

type SocketProviderProps = { children: ReactElement };

console.log("Connecting socket...");

const socket = io(config.backendBaseUrl, { autoConnect: true });
export const SocketContext = createContext(socket);

const SocketProvider = ({ children }: SocketProviderProps) => {
  useGameRoomEvents(socket);
  useGameEvents(socket);
  useReconnection(socket);

  useEffect(() => {
    socket.on("connect", onConnect);
    return () => {
      socket.off("connect", onConnect);
    };
  }, []);

  const onConnect = () => {
    console.log("socket connected, setting id %s to headers", socket.id);
    axios.defaults.headers.common["Socket-Id"] = socket.id;
  };

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
