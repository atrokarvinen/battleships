import { Box, Stack } from "@mui/material";
import PrimaryBoard from "../board/primaryBoard";
import TrackingBoard from "../board/trackingBoard";
import { useBreakpoint } from "../navigation/useBreakpoint";
import { PlayerName } from "./playerName";
import RevealOpponentBoard from "./revealOpponentBoard";

type PlayerAreaProps = {
  player1Name: string;
  player1Id: string;

  player2Name: string;
  player2Id: string;

  gameId: string;
};

const PlayerArea = ({
  player1Name,
  player1Id,
  player2Name,
  player2Id,
  gameId,
}: PlayerAreaProps) => {
  const { sm } = useBreakpoint();

  return (
    <Box>
      <Stack direction={sm ? "column" : "row"} spacing={2}>
        <Stack direction="column" spacing={1}>
          <PlayerName name={player1Name} id={player1Id} />
          <PrimaryBoard playerId={player1Id} />
        </Stack>
        <Stack direction="column" spacing={1}>
          <PlayerName name={player2Name} id={player2Id} />
          <TrackingBoard gameId={gameId} playerId={player1Id} />
          {process.env.NODE_ENV === "development" && (
            <RevealOpponentBoard opponentId={player2Id} gameId={gameId} />
          )}
        </Stack>
      </Stack>
    </Box>
  );
};

export default PlayerArea;
