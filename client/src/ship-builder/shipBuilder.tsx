import { Stack, Typography } from "@mui/material";
import { useParams } from "react-router";
import ShipBuilderActions from "./shipBuilderActions";

type ShipBuilderProps = {};

const ShipBuilder = ({}: ShipBuilderProps) => {
  const gameRoomId = useParams().id;

  return (
    <Stack
      mt={2}
      direction="column"
      justifyContent="center"
      alignItems="center"
    >
      <ShipBuilderActions gameRoomId={gameRoomId!} />
      <Typography maxWidth={300} mt={2}>
        Place your ships around the board. Ships may not be placed on top of
        each other nor directly adjacent to each other in cardinal directions.
      </Typography>
    </Stack>
  );
};

export default ShipBuilder;
