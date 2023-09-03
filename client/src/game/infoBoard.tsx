import { Box, Typography } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { selectGame } from "../redux/selectors";

type InfoBoardProps = { gameRoomId?: string };

const InfoBoard = ({ gameRoomId }: InfoBoardProps) => {
  const gameRoom = useAppSelector((state) => selectGame(state, gameRoomId));
  return (
    <Box>
      <Typography variant="h5">{gameRoom?.title}</Typography>
    </Box>
  );
};

export default InfoBoard;
