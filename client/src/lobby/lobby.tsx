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
import { setGameRooms } from "../redux/gameRoomSlice";
import { useAppDispatch } from "../redux/hooks";
import { selectGames } from "../redux/selectors";
import {
  createGameRequest,
  deleteAllGamesRequest,
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
      console.log("created game: " + JSON.stringify(response.data));
      setIsCreateGameOpen(false);
    } catch (error) {
      console.log("failed to create game: " + error);
    }
  }

  async function getGameRooms() {
    try {
      const response = await getGamesRequest();
      const games = response.data;
      console.log("fetched games count: " + games.length);
      dispatch(setGameRooms(games));
    } catch (error) {
      console.log("failed to get all games: " + error);
    }
  }

  async function deleteAllGameRooms() {
    try {
      await deleteAllGamesRequest();
      console.log("successfully deleted all games");
    } catch (error) {
      console.log("failed to delete all games: " + error);
    }
  }

  async function joinGame(gameId: string) {
    try {
      await joinGameRequest(gameId);
      navigate(`/game/${gameId}`);
      onGameDetailsClosed();
    } catch (error) {
      handleError(error);
    }
  }

  async function leaveGame(gameId: string) {
    try {
      await leaveGameRequest(gameId);
      onGameDetailsClosed();
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
        <Button onClick={getGameRooms} variant="contained" sx={{ mb: 2 }}>
          Refresh
        </Button>
        <Button onClick={deleteAllGameRooms} variant="contained" sx={{ mb: 2 }}>
          Delete all
        </Button>
        <Button onClick={() => setIsCreateGameOpen(true)} variant="contained">
          Create new game
        </Button>
      </Grid>

      <GameDetails
        gameId={selectedGameRoomId}
        onClose={onGameDetailsClosed}
        onGo={(gameId) => navigate(`/game/${gameId}`)}
        onJoin={joinGame}
        onLeave={leaveGame}
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
