import { Server } from "socket.io";
import { addChatListeners } from "./chatListeners";
import { addRoomListeners } from "./roomListeners";

export const addListeners = (io: Server) => {
  io.on("connection", (socket) => {
    // console.log(`socket '${socketId}' joined`);
    // console.log("Socket count:", io.of("/").sockets.size);

    addRoomListeners(io, socket);
    addChatListeners(io, socket);
  });
};
