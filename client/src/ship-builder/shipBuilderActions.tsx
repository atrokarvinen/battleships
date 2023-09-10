import ArrowDown from "@mui/icons-material/ArrowDropDown";
import ArrowUp from "@mui/icons-material/ArrowDropUp";
import ArrowLeft from "@mui/icons-material/ArrowLeft";
import ArrowRight from "@mui/icons-material/ArrowRight";
import Loop from "@mui/icons-material/Loop";
import { Grid } from "@mui/material";
import { useDispatch } from "react-redux";
import { useApiRequest } from "../api/useApiRequest";
import { ShipDTO } from "../game/api/apiModel";
import { transformShip } from "../redux/activeGameSlice";
import { useAppSelector } from "../redux/hooks";
import {
  selectActiveGameId,
  selectSelectedShip,
  selectUserId,
} from "../redux/selectors";
import { TransformShipPayload, transformShipRequest } from "./api/api";
import CustomIconButton from "./customIconButton";
import { transformSelectedShip } from "./redux/shipBuilderSlice";
import {
  canMoveDown,
  canMoveLeft,
  canMoveRight,
  canMoveUp,
  canRotate,
} from "./transform-validation";

type ShipBuilderActionsProps = { gameRoomId: string };

const ShipBuilderActions = ({ gameRoomId }: ShipBuilderActionsProps) => {
  const { request } = useApiRequest();
  const dispatch = useDispatch();

  const gameId = useAppSelector(selectActiveGameId);
  const playerId = useAppSelector(selectUserId);
  const ship = useAppSelector(selectSelectedShip);

  const handleTransform = async (transformedShip: ShipDTO) => {
    if (!gameId || !playerId) return;
    const payload: TransformShipPayload = {
      gameId,
      playerId,
      ship: transformedShip,
    };
    const response = await request(transformShipRequest(payload), true);
    if (response) {
      dispatch(transformShip(payload));
      dispatch(transformSelectedShip(transformedShip));
    }
  };

  const handleMoveUp = async () => {
    if (!ship) return;
    const transformedShip: ShipDTO = {
      ...ship,
      start: { x: ship.start.x, y: ship.start.y - 1 },
    };
    await handleTransform(transformedShip);
  };
  const handleMoveDown = async () => {
    if (!ship) return;
    const transformedShip: ShipDTO = {
      ...ship,
      start: { x: ship.start.x, y: ship.start.y + 1 },
    };
    await handleTransform(transformedShip);
  };
  const handleMoveLeft = async () => {
    if (!ship) return;
    const transformedShip: ShipDTO = {
      ...ship,
      start: { x: ship.start.x - 1, y: ship.start.y },
    };
    await handleTransform(transformedShip);
  };
  const handleMoveRight = async () => {
    if (!ship) return;
    const transformedShip: ShipDTO = {
      ...ship,
      start: { x: ship.start.x + 1, y: ship.start.y },
    };
    await handleTransform(transformedShip);
  };
  const handleRotate = async () => {
    if (!ship) return;
    const transformedShip: ShipDTO = { ...ship, isVertical: !ship.isVertical };
    await handleTransform(transformedShip);
  };

  return (
    <Grid container spacing={1}>
      <Grid item xs={4} />
      <Grid item xs={4}>
        <CustomIconButton
          icon={<ArrowUp />}
          onClick={handleMoveUp}
          disabled={!!ship && !canMoveUp(ship)}
        />
      </Grid>
      <Grid item xs={4}>
        <CustomIconButton
          icon={<Loop />}
          onClick={handleRotate}
          disabled={!!ship && !canRotate(ship)}
        />
      </Grid>
      <Grid item xs={4}>
        <CustomIconButton
          icon={<ArrowLeft />}
          onClick={handleMoveLeft}
          disabled={!!ship && !canMoveLeft(ship)}
        />
      </Grid>
      <Grid item xs={4}>
        <CustomIconButton
          icon={<ArrowDown />}
          onClick={handleMoveDown}
          disabled={!!ship && !canMoveDown(ship)}
        />
      </Grid>
      <Grid item xs={4}>
        <CustomIconButton
          icon={<ArrowRight />}
          onClick={handleMoveRight}
          disabled={!!ship && !canMoveRight(ship)}
        />
      </Grid>
    </Grid>
  );
};

export default ShipBuilderActions;
