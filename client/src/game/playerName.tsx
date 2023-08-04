import { Box, Typography, useTheme } from "@mui/material";
import cn from "classnames";
import { useAppSelector } from "../redux/hooks";
import { selectActivePlayerId } from "../redux/selectors";
import styles from "./styles.module.scss";

type PlayerNameProps = {
  id: string;
  name: string;
};

const PlayerName = ({ id, name }: PlayerNameProps) => {
  const theme = useTheme();
  const playerIdToPlay = useAppSelector(selectActivePlayerId);
  const isPlayersTurn = playerIdToPlay === id;

  return (
    <Box display="flex" justifyContent="center">
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
    </Box>
  );
};

export { PlayerName };
