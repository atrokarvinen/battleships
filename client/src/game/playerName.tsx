import { Typography } from "@mui/material";
import cn from "classnames";
import { useAppSelector } from "../redux/hooks";
import { selectActivePlayerId } from "../redux/selectors";
import styles from "./styles.module.scss";

type PlayerNameProps = {
  id: string;
  name: string;
};

const PlayerName = ({ id, name }: PlayerNameProps) => {
  const playerIdToPlay = useAppSelector(selectActivePlayerId);
  const isPlayersTurn = playerIdToPlay === id;

  return (
    <Typography
      variant="h6"
      className={cn(styles.playerName, {
        [styles.active]: isPlayersTurn,
      })}
      data-testid="player-name"
    >
      {name ?? "N/A"}
    </Typography>
  );
};

export { PlayerName };
