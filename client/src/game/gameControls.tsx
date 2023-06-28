import { Button, Stack } from "@mui/material";
import {
  openGameOverDialog,
  setIsGameOver,
  setWinnerPlayerId,
} from "../redux/activeGameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectActivePlayerId, selectBoardState } from "../redux/selectors";
import {
  mapGameDtoToActiveGame,
  resetGameRequest,
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
  const board = useAppSelector(selectBoardState);

  async function startGame() {
    const response = await startGameRequest({ gameRoomId, playerIds });

    const startedGame: GameDTO = response.data;
    const activeGame = mapGameDtoToActiveGame(startedGame);
    console.log("started game:", activeGame);

    // Response received as event
    // dispatch(setActiveGame(activeGame));
  }

  async function endGame() {
    const response = await resetGameRequest({ gameRoomId });
    // dispatch(end());
  }

  function testGameOver() {
    dispatch(setIsGameOver(true));
    dispatch(openGameOverDialog());
    dispatch(setWinnerPlayerId(player));
  }

  function resetGameOver() {
    dispatch(setIsGameOver(false));
    dispatch(setWinnerPlayerId(undefined));
  }

  return (
    <Stack spacing={1} alignItems={"center"}>
      <Button sx={{ width: 100 }} variant="contained" onClick={startGame}>
        Start
      </Button>
      <Button sx={{ width: 100 }} variant="contained" onClick={endGame}>
        End
      </Button>
      <Button sx={{ width: 100 }} variant="contained" onClick={testGameOver}>
        Test game over
      </Button>
      <Button sx={{ width: 100 }} variant="contained" onClick={resetGameOver}>
        Reset game over
      </Button>
    </Stack>
  );
};

export default GameControls;
