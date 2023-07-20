import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router";
import { handleError } from "../api/errorHandling";
import {
  addNewGameRoom,
  joinGame,
  leaveGame,
  setGameRooms,
} from "../redux/gameRoomSlice";
import { useAppDispatch } from "../redux/hooks";
import { addPlayerToGame, removePlayerFromGame } from "../redux/playerSlice";
import { selectGames } from "../redux/selectors";
import {
  createGameRequest,
  getGamesRequest,
  joinGameRequest,
  leaveGameRequest,
} from "./api";
import { CreateGame } from "./createGame";
import CreateGameForm from "./createGameForm";
import GameDetails from "./gameDetails";
import GamesTable from "./gamesTable";

type LobbyProps = {};

const Lobby = ({}: LobbyProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
  const [selectedGameRoomId, setSelectedGameRoomId] = useState<
    string | undefined
  >();

  const gameRooms = useSelector(selectGames);

  useEffect(() => {
    getGameRooms();
  }, []);

  function onCreateGameCancel() {
    setIsCreateGameOpen(false);
  }

  async function onCreateGameSubmitted(data: CreateGame) {
    console.log("creating game with data: " + JSON.stringify(data));

    try {
      const response = await createGameRequest(data);
      console.log("Game %s created", response.data);
      dispatch(addNewGameRoom(response.data));
      setIsCreateGameOpen(false);
    } catch (error) {
      handleError(error);
    }
  }

  async function getGameRooms() {
    try {
      const response = await getGamesRequest();
      const games = response.data;
      console.log("fetched games count: " + games.length);
      dispatch(setGameRooms(games));
    } catch (error) {
      handleError(error);
    }
  }

  async function onJoinGame(gameId: string) {
    try {
      const response = await joinGameRequest(gameId);
      navigate(`/game/${gameId}`);
      onGameDetailsClosed();
      dispatch(joinGame(response.data));
      dispatch(addPlayerToGame(response.data));
    } catch (error) {
      handleError(error);
    }
  }

  async function onLeaveGame(gameId: string) {
    try {
      const response = await leaveGameRequest(gameId);
      onGameDetailsClosed();
      dispatch(leaveGame(response.data));
      dispatch(removePlayerFromGame(response.data));
    } catch (error) {
      handleError(error);
    }
  }

  const onGameDetailsClosed = () => {
    setSelectedGameRoomId(undefined);
  };

  return (
    <Grid container spacing={3} padding={2}>
      <Grid item xs={10}>
        <GamesTable
          games={gameRooms}
          onGameClicked={(gameId) => setSelectedGameRoomId(gameId)}
        />
      </Grid>

      <Grid
        item
        display="flex"
        flexDirection="column"
        justifyContent={"center"}
      >
        <Button onClick={() => setIsCreateGameOpen(true)} variant="contained">
          Create new game
        </Button>
      </Grid>

      <GameDetails
        gameId={selectedGameRoomId}
        onClose={onGameDetailsClosed}
        onGo={(gameId) => navigate(`/game/${gameId}`)}
        onJoin={onJoinGame}
        onLeave={onLeaveGame}
      />

      <Dialog
        open={isCreateGameOpen}
        onClose={onCreateGameCancel}
        data-testid="create-game-dialog"
      >
        <DialogTitle>Create game</DialogTitle>
        <DialogContent>
          <CreateGameForm
            onCancel={onCreateGameCancel}
            onSubmit={onCreateGameSubmitted}
          />
        </DialogContent>
      </Dialog>
    </Grid>
  );
};

export default Lobby;
