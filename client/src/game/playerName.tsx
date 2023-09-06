import { Box, Typography } from "@mui/material";
import cn from "classnames";
import { useAppSelector } from "../redux/hooks";
import {
  selectActivePlayerId,
  selectShipBuilderActive,
} from "../redux/selectors";
import PlayerNameStatus from "./playerNameStatus";
import styles from "./styles.module.scss";

type PlayerNameProps = {
  id: string;
  name: string;
};

const PlayerName = ({ id, name }: PlayerNameProps) => {
  const isShipBuilderActive = useAppSelector(selectShipBuilderActive);
  const playerIdToPlay = useAppSelector(selectActivePlayerId);
  const isPlayersTurn = playerIdToPlay === id;

  return (
    <Box
      data-testid="player-info"
      display="flex"
      justifyContent="center"
      alignItems="center"
    >
      <Typography
        data-testid="player-name"
        variant="h6"
        pl={1}
        pr={1}
        className={cn(styles.playerName, {
          [styles.active]: isPlayersTurn,
        })}
      >
        {name ?? "N/A"}
      </Typography>
      {isShipBuilderActive && <PlayerNameStatus id={id} />}
    </Box>
  );
};

export { PlayerName };
