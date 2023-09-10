import { Box, Stack } from "@mui/material";
import PrimaryBoard from "../board/primaryBoard";
import TrackingBoard from "../board/trackingBoard";
import { useBreakpoint } from "../navigation/useBreakpoint";
import { useAppSelector } from "../redux/hooks";
import { selectShipBuilderActive } from "../redux/selectors";
import ShipBuilder from "../ship-builder/shipBuilder";
import { PlayerName } from "./playerName";

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
  const isShipBuilderActive = useAppSelector(selectShipBuilderActive);

  const OpponentBoard = () => {
    return (
      <TrackingBoard gameId={gameId} ownId={player1Id} enemyId={player2Id} />
    );
  };
 
  return (
    <Box>
      <Stack
        spacing={2}
        direction={sm ? "column" : "row"}
        alignItems={sm ? "center" : undefined}
        justifyContent={sm ? undefined : "center"}
      >
        <Stack direction="column" spacing={1}>
          <PlayerName name={player1Name} id={player1Id} />
          <PrimaryBoard ownId={player1Id} enemyId={player2Id} />
        </Stack>
        <Stack direction="column" spacing={1} justifyContent="space-between">
          <PlayerName name={player2Name} id={player2Id} />
          {isShipBuilderActive ? <ShipBuilder /> : <OpponentBoard />}
        </Stack>
      </Stack>
    </Box>
  );
};

export default PlayerArea;
