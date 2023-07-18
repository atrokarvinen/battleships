import { ReactElement, createContext } from "react";
import { io } from "socket.io-client";
import { useGameEvents } from "./useGameEvents";
import { useGameRoomEvents } from "./useGameRoomEvents";

type SocketProviderProps = { children: ReactElement };

console.log("Connecting socket...");

const socket = io("ws://localhost:3001", { autoConnect: true });
export const SocketContext = createContext(socket);

const SocketProvider = ({ children }: SocketProviderProps) => {
  useGameRoomEvents(socket);
  useGameEvents(socket);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
