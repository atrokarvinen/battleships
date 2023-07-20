import { Button, Stack } from "@mui/material";
import { handleError } from "../api/errorHandling";
import { useBreakpoint } from "../navigation/useBreakpoint";
import { setActiveGame } from "../redux/activeGameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectActivePlayerId, selectIsGameStarted } from "../redux/selectors";
import {
  confirmPlacementsRequest,
  endGameRequest,
  mapGameDtoToActiveGame,
  startGameRequest,
} from "./api";
import { GameDTO } from "./apiModel";

type GameControlsProps = {
  gameRoomId: string;
  playerIds: string[];
};

const GameControls = ({ gameRoomId, playerIds }: GameControlsProps) => {
  const dispatch = useAppDispatch();
  const player = useAppSelector(selectActivePlayerId);
  const isGameStarted = useAppSelector(selectIsGameStarted);
  const { sm } = useBreakpoint();

  async function startGame() {
    const response = await startGameRequest({ gameRoomId, playerIds });

    const startedGame: GameDTO = response.data;
    const activeGame = mapGameDtoToActiveGame(startedGame);
    console.log("started game:", activeGame);
    dispatch(setActiveGame(activeGame));
  }

  async function endGame() {
    const response = await endGameRequest({ gameRoomId });
    // dispatch(end());
  }

  const handleConfirm = async () => {
    try {
      const response = await confirmPlacementsRequest({ gameRoomId });
    } catch (error) {
      handleError(error);
    }
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
      <Button
        sx={{ width: 100 }}
        variant="contained"
        onClick={handleConfirm}
        disabled={!isGameStarted}
      >
        Confirm
      </Button>
    </Stack>
  );
};

export default GameControls;
