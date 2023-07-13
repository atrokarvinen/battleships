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
        <Box>
          <PlayerName name={player1Name} id={player1Id} />
          <PrimaryBoard gameId={gameId} playerId={player1Id} />
        </Box>
        <Box>
          <PlayerName name={player2Name} id={player2Id} />
          <TrackingBoard gameId={gameId} playerId={player1Id} />
          <RevealOpponentBoard />
        </Box>
      </Stack>
    </Box>
  );
};

export default PlayerArea;
