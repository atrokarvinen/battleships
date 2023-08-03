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
import { useApiRequest } from "../api/useApiRequest";
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
  const { request } = useApiRequest();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
  const [selectedGameRoomId, setSelectedGameRoomId] = useState<string>();

  const gameRooms = useSelector(selectGames);

  useEffect(() => {
    getGameRooms();
  }, []);

  function onCreateGameCancel() {
    setIsCreateGameOpen(false);
  }

  async function onCreateGameSubmitted(data: CreateGame) {
    console.log("creating game with data: ", data);

    const response = await request(createGameRequest(data), true);
    if (!response) return;
    console.log("Game %s created", response.data);
    dispatch(addNewGameRoom(response.data));
    setIsCreateGameOpen(false);
  }

  async function getGameRooms() {
    const response = await request(getGamesRequest());
    if (!response) return;
    const games = response.data;
    console.log("fetched games count: " + games.length);
    dispatch(setGameRooms(games));
  }

  async function onJoinGame(gameId: string) {
    const response = await request(joinGameRequest(gameId), true);
    if (!response) return;
    navigate(`/game/${gameId}`);
    onGameDetailsClosed();
    dispatch(joinGame(response.data));
    dispatch(addPlayerToGame(response.data));
  }

  async function onLeaveGame(gameId: string) {
    const response = await request(leaveGameRequest(gameId), true);
    if (!response) return;
    onGameDetailsClosed();
    dispatch(leaveGame(response.data));
    dispatch(removePlayerFromGame(response.data));
  }

  const onGameDetailsClosed = () => {
    setSelectedGameRoomId(undefined);
  };

  return (
    <Grid container spacing={3} padding={2}>
      <Grid item xs={12}>
        <GamesTable
          games={gameRooms}
          onGameClicked={(gameId) => setSelectedGameRoomId(gameId)}
        />
      </Grid>

      <Grid item display="flex" justifyContent="center" xs={12}>
        <Button
          onClick={() => setIsCreateGameOpen(true)}
          variant="contained"
          sx={{ maxWidth: 250 }}
        >
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
