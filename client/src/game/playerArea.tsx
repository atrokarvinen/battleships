import { Box, Typography } from "@mui/material";
import cn from "classnames";
import PrimaryBoard from "../board/primaryBoard";
import TrackingBoard from "../board/trackingBoard";
import { useAppSelector } from "../redux/hooks";
import { selectActivePlayerId } from "../redux/selectors";
import styles from "./styles.module.scss";

type PlayerAreaProps = {
  name: string;
  playerId: string;
  gameId: string;
};

const PlayerArea = ({ name, playerId, gameId }: PlayerAreaProps) => {
  const playerIdToPlay = useAppSelector(selectActivePlayerId);
  const isPlayersTurn = playerIdToPlay === playerId;
  // const players = useAppSelector((state) => selectPlayersInGame(state, gameId));
  // const player = players.find((p) => p.id === playerId);

  // console.log("players:", players);

  return (
    <Box>
      <Typography
        variant="h6"
        className={cn(styles.playerName, { [styles.active]: isPlayersTurn })}
        data-testid="player-name"
      >
        {name}
      </Typography>
      <Box>
        <Box>
          <Typography>Primary board</Typography>
          <PrimaryBoard gameId={gameId} playerId={playerId} />
        </Box>
        <Box>
          <Typography>Tracking board</Typography>
          <TrackingBoard gameId={gameId} playerId={playerId} />
        </Box>
      </Box>
    </Box>
  );
};

export default PlayerArea;
