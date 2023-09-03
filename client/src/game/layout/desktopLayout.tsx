import { Stack } from "@mui/material";
import GameOverDialog from "../gameOverDialog";
import { LayoutProps } from "./layoutProps";

const DesktopLayout = ({
  InfoBoard,
  PlayerArea,
  GameControls,
}: LayoutProps) => {
  return (
    <Stack direction="column" mt={2} data-testid="active-game" spacing={1}>
      <GameOverDialog />
      {InfoBoard}
      {PlayerArea}
      {GameControls}
    </Stack>
  );
};

export default DesktopLayout;
