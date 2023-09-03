import { Stack } from "@mui/material";
import GameOverDialog from "../gameOverDialog";
import { LayoutProps } from "./layoutProps";

const MobileLayout = ({ InfoBoard, PlayerArea, GameControls }: LayoutProps) => {
  return (
    <Stack
      data-testid="active-game"
      direction="column"
      mt={2}
      mb={2}
      spacing={1}
    >
      <GameOverDialog />
      <Stack spacing={3} direction="column" alignItems="center">
        {InfoBoard}
        {GameControls}
      </Stack>
      {PlayerArea}
    </Stack>
  );
};

export default MobileLayout;
