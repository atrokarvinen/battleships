import { Box, Typography } from "@mui/material";
import cn from "classnames";
import BoardEnemy from "../board/board-enemy";
import BoardOwn from "../board/board-own";
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
          <Typography>Own board</Typography>
          <BoardOwn gameId={gameId} playerId={playerId} />
        </Box>
        <Box>
          <Typography>Opponent board</Typography>
          <BoardEnemy gameId={gameId} playerId={playerId} />
        </Box>
      </Box>
    </Box>
  );
};

export default PlayerArea;
