import { Button } from "@mui/material";
import styles from "./styles.module.scss";
import { io } from "socket.io-client";

type SocketProps = {};

export const socket = io("ws://localhost:3001");

const Socket = ({}: SocketProps) => {
  // receive a message from the server
  socket.on("hello-from-server", (...args) => {
    console.log("[client] hello from server");
    // ...
  });

  const testConnection = () => {
    console.log("testing connection...");

    console.log("connected: " + socket.connected);

    // const response = socket.connect();

    console.log("connected: " + socket.connected);

    // send a message to the server
    socket.emit("hello from client", 5, "6", { 7: Uint8Array.from([8]) });
  };
  return (
    <div>
      <Button onClick={testConnection}>Test connection</Button>
    </div>
  );
};

export default Socket;
