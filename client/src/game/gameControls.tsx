import { Button, Stack } from "@mui/material";
import { handleError } from "../api/errorHandling";
import { useApiRequest } from "../api/useApiRequest";
import { useBreakpoint } from "../navigation/useBreakpoint";
import {
  attackSquare,
  gameOver,
  setActiveGame,
} from "../redux/activeGameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectIsGameStarted } from "../redux/selectors";
import {
  confirmPlacementsRequest,
  endGameRequest,
  getAiAttack,
  mapGameDtoToActiveGame,
  startGameRequest,
} from "./api";
import { GameDTO } from "./apiModel";

type GameControlsProps = { gameRoomId: string };

const GameControls = ({ gameRoomId }: GameControlsProps) => {
  const { request } = useApiRequest();
  const dispatch = useAppDispatch();
  const isGameStarted = useAppSelector(selectIsGameStarted);
  const { sm } = useBreakpoint();

  async function startGame() {
    const response = await request(startGameRequest({ gameRoomId }), true);
    if (!response) return;
    const startedGame: GameDTO = response.data;
    const activeGame = mapGameDtoToActiveGame(startedGame);
    console.log("started game:", activeGame);
    dispatch(setActiveGame(activeGame));
  }

  async function endGame() {
    const response = await request(endGameRequest({ gameRoomId }), true);
    if (!response) return;
    const activeGame = mapGameDtoToActiveGame(response.data);
    const { winnerPlayerId } = activeGame;
    dispatch(setActiveGame(activeGame));
    dispatch(gameOver(winnerPlayerId || "N/A"));
  }

  const handleConfirm = async () => {
    try {
      const response = await confirmPlacementsRequest({ gameRoomId });
    } catch (error) {
      handleError(error);
    }
  };

  const requestAiAttack = async () => {
    const response = await request(getAiAttack({ gameRoomId }), true);
    if (!response) return;
    const attack = response.data;
    dispatch(attackSquare(attack));
  };

  return (
    <Stack spacing={1} direction={sm ? "row" : "row"} alignItems="center">
      <Button
        sx={{ width: 100 }}
        variant="contained"
        onClick={startGame}
        disabled={isGameStarted}
      >
        Start
      </Button>
      <Button
        sx={{ width: 100 }}
        variant="contained"
        onClick={endGame}
        disabled={!isGameStarted}
      >
        End
      </Button>
      {process.env.NODE_ENV === "development" && (
        <Button
          sx={{ width: 100 }}
          variant="contained"
          onClick={handleConfirm}
          disabled={!isGameStarted}
        >
          Confirm
        </Button>
      )}
      <Button variant="contained" onClick={requestAiAttack}>
        Request AI Move
      </Button>
    </Stack>
  );
};

export default GameControls;
