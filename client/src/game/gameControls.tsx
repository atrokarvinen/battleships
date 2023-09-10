import { Button, Stack } from "@mui/material";
import { useApiRequest } from "../api/useApiRequest";
import { gameOver, setActiveGame } from "../redux/activeGameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectActiveGameId,
  selectIsGameEnded,
  selectIsGameStarted,
  selectShipBuilderActive,
} from "../redux/selectors";
import {
  ConfirmPlacementsPayload,
  confirmPlacementsRequest,
} from "../ship-builder/api/api";
import { setSelectedShip } from "../ship-builder/redux/shipBuilderSlice";
import {
  endGameRequest,
  mapGameDtoToActiveGame,
  startGameRequest,
} from "./api/api";
import { GameDTO } from "./api/apiModel";

type GameControlsProps = { gameRoomId: string };

const GameControls = ({ gameRoomId }: GameControlsProps) => {
  const { request } = useApiRequest();
  const dispatch = useAppDispatch();
  const isGameEnded = useAppSelector(selectIsGameEnded);
  const isGameStarted = useAppSelector(selectIsGameStarted);
  const isShipBuilderActive = useAppSelector(selectShipBuilderActive);
  const gameId = useAppSelector(selectActiveGameId);

  async function startGame() {
    const response = await request(startGameRequest({ gameRoomId }), true);
    if (!response) return;
    const startedGame: GameDTO = response.data;
    const activeGame = mapGameDtoToActiveGame(startedGame);
    console.log("started game:", activeGame);
    dispatch(setActiveGame(activeGame));
    dispatch(setSelectedShip(undefined));
  }

  async function endGame() {
    const response = await request(endGameRequest({ gameRoomId }), true);
    if (!response) return;
    const activeGame = mapGameDtoToActiveGame(response.data);
    const { winnerPlayerId } = activeGame;
    dispatch(setActiveGame(activeGame));
    dispatch(gameOver(winnerPlayerId || "N/A"));
  }

  const confirm = async () => {
    const payload: ConfirmPlacementsPayload = { gameId };
    const response = await request(confirmPlacementsRequest(payload), true);
    if (!response) return;
    const activeGame = mapGameDtoToActiveGame(response.data);
    dispatch(setActiveGame(activeGame));
  };

  return (
    <Stack spacing={1} direction="row" alignItems="center">
      {isShipBuilderActive ? (
        <Button sx={{ width: 100 }} variant="contained" onClick={confirm}>
          Confirm
        </Button>
      ) : (
        <Button
          sx={{ width: 100 }}
          variant="contained"
          onClick={startGame}
          disabled={isGameStarted}
        >
          Start
        </Button>
      )}
      <Button
        sx={{ width: 100 }}
        variant="contained"
        onClick={endGame}
        disabled={isGameEnded}
      >
        End
      </Button>
    </Stack>
  );
};

export default GameControls;
