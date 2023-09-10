import { Server } from "socket.io";
import { addRoomListeners } from "./roomListeners";

export const addListeners = (io: Server) => {
  io.on("connection", (socket) => {
    addRoomListeners(io, socket);
  });
};
