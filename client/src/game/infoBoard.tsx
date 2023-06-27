import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import styles from "./styles.module.scss";
import {
  selectGame,
  selectIsGameOver,
  selectActivePlayerId,
  selectActiveGame,
} from "../redux/selectors";

type InfoBoardProps = { gameRoomId?: string };

const InfoBoard = ({ gameRoomId }: InfoBoardProps) => {
  const game = useAppSelector((state) => selectGame(state, gameRoomId));
  const playerIdToPlay = useAppSelector(selectActivePlayerId);
  const isGameOver = useAppSelector(selectIsGameOver);
  return (
    <Box>
      <Typography variant="h6">{`Game: ${game?.title}`}</Typography>
      <Typography variant="h6">{`Player to play: ${playerIdToPlay}`}</Typography>
      <Typography>{`Is game over: ${isGameOver}`}</Typography>
    </Box>
  );
};

export default InfoBoard;
