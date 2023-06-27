import { Box, Button, Stack } from "@mui/material";
import styles from "./styles.module.scss";
import { useContext } from "react";
import { SocketContext } from "../io/socketProvider";

type SocketTestProps = {};

const SocketTest = ({}: SocketTestProps) => {
  const socket = useContext(SocketContext);

  return (
    <Box sx={{ height: "100%" }}>
      <Stack>
        Socket test
        <span>{`Id: ${socket.id}`}</span>
        <Button onClick={() => socket.connect()}>Connect</Button>
        <Button onClick={() => socket.disconnect()}>Disconnect</Button>
        <Button onClick={() => socket.emit("chatMessageToServer", "test")}>
          Echo
        </Button>
        <Button onClick={() => socket.emit("toAll")}>To All</Button>
        <Button onClick={() => socket.emit("disconnectAll")}>
          Disconnect All
        </Button>
      </Stack>
    </Box>
  );
};

export default SocketTest;
