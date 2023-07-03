import { Server } from "socket.io";

// TODO Split listeners
export const addListeners = (io: Server) => {
  io.on("connection", (socket) => {
    const socketId = socket.id;

    // console.log(`socket '${socketId}' joined`);
    // console.log("Socket count:", io.of("/").sockets.size);

    socket.emit("helloFromServer");

    socket.on("toAll", () => {
      io.sockets.emit("helloFromServer");
    });
    socket.on("disconnectAll", () => {
      io.of("/").disconnectSockets();
    });
    socket.on("hello from client", (...args) => {
      socket.emit("hello-from-server", 1, "2", { 3: Buffer.from([4]) });
      console.log("[server] hello from client");
    });
    socket.on("joinRoom", (roomName) => {
      console.log(`Socket '${socketId}' joined room '${roomName}'`);
      socket.join(roomName);
    });
    socket.on("leaveRoom", (roomName) => {
      console.log(`Socket '${socketId}' left room '${roomName}'`);
      socket.leave(roomName);
    });
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
    socket.on("disconnect", () => {
      console.log(`socket '${socketId}' disconnected`);
    });
  });
};
