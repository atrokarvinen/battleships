import CheckBoxIcon from "@mui/icons-material/CheckBox";
import { Box, CircularProgress } from "@mui/material";
import { useAppSelector } from "../redux/hooks";
import { selectIsPlayerReady } from "../redux/selectors";

type PlayerNameStatusProps = { id: string };

const PlayerNameStatus = ({ id }: PlayerNameStatusProps) => {
  const hasDonePlacements = useAppSelector(selectIsPlayerReady(id));

  if (hasDonePlacements)
    return (
      <CheckBoxIcon data-testid="ready-icon" color="success" fontSize="large" />
    );
  return (
    <Box ml={2} display="flex" alignItems="center">
      <CircularProgress data-testid="thinking-icon" size={32} />
    </Box>
  );
};

export default PlayerNameStatus;
