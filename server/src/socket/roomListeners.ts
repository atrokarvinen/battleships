import { Server, Socket } from "socket.io";

export const addRoomListeners = (io: Server, socket: Socket) => {
  const socketId = socket.id;

  socket.on("joinRoom", (roomName) => {
    console.log(`Socket '${socketId}' joined room '${roomName}'`);
    socket.join(roomName);
  });
  socket.on("leaveRoom", (roomName) => {
    console.log(`Socket '${socketId}' left room '${roomName}'`);
    socket.leave(roomName);
  });
};
