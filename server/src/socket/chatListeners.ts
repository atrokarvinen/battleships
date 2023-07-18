import { Server, Socket } from "socket.io";

export const addChatListeners = (io: Server, socket: Socket) => {
  const socketId = socket.id;

  socket.on("chatMessageToServer", (message) => {
    console.log(`[${socketId}] Received message from client:`, message);
    const { text, username, userId } = message;
    const chatMessage = {
      text,
      sender: username,
      senderId: userId,
      timestamp: new Date(),
    };
    io.of("/").emit("chatMessageToClient", chatMessage);
    // socket.broadcast.emit("chatMessageToClient", message);
  });
  socket.on("chatMessageToRoom", (message) => {
    console.log(`[${socketId}] Room message from client:`, message);
    const { text, username, userId, roomName } = message;
    const chatMessage = {
      text,
      sender: username,
      senderId: userId,
      timestamp: new Date(),
    };
    io.to(roomName).emit("chatMessageToClient", chatMessage);
  });
};
