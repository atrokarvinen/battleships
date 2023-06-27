import {
  Box,
  List,
  ListItem,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import { socket } from "../io/socket";
import { useAppSelector } from "../redux/hooks";
import { selectChatMessages } from "../redux/selectors";
import { useAuth } from "../auth/useAuth";

type GameChatProps = {
  gameId: string;
  playerIds: string[];
};

const GameChat = ({ gameId, playerIds }: GameChatProps) => {
  const { username, userId } = useAuth();
  const [typedMessage, setTypedMessage] = useState("");

  const messages = useAppSelector(selectChatMessages);

  async function sendMessage() {
    if (!typedMessage) {
      console.log("cannot send empty message");
      return;
    }

    console.log(`sending message '${typedMessage}' to server...`);
    socket.emit("chatMessageToRoom", {
      text: typedMessage,
      username,
      userId,
      roomName: gameId,
    });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") {
      sendMessage();
      setTypedMessage("");
    }
  }

  return (
    <Box width={500}>
      <Paper sx={{ height: 400 }}>
        <List>
          {messages.map((m, index) => {
            const time = new Date(m.timestamp).toLocaleTimeString("fi");
            const p1Id = playerIds.length > 0 ? playerIds[0] : undefined;
            const p2Id = playerIds.length > 1 ? playerIds[1] : undefined;

            const color =
              m.senderId === p1Id
                ? "red"
                : m.senderId === p2Id
                ? "blue"
                : "black";
            return (
              <ListItem key={index}>
                <Typography>{`${time}`}</Typography>
                &nbsp;
                <Typography color={color} fontWeight="bold">
                  {m.sender}
                </Typography>
                <Typography>:</Typography>
                &nbsp;
                <Typography>{m.text}</Typography>
              </ListItem>
            );
          })}
        </List>
      </Paper>
      <TextField
        id="chatTextInput"
        label="Send message"
        value={typedMessage}
        onChange={(e) => setTypedMessage(e.target.value)}
        onKeyDown={handleKeyDown}
        fullWidth
      />
    </Box>
  );
};

export default GameChat;
