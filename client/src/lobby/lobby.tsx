import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  Grid,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { useAppSelector } from "../redux/hooks";
import { selectGames } from "../redux/selectors";
import { useLobbyApi } from "./api/useLobbyApi";
import { CreateGame } from "./createGameRoom/createGame";
import CreateGameForm from "./createGameRoom/createGameForm";
import GameDetails from "./gameDetails/gameDetails";
import GamesTable from "./gamesTable";

type LobbyProps = {};

const Lobby = ({}: LobbyProps) => {
  const { getGames, createGame, joinGame, leaveGame } = useLobbyApi();
  const navigate = useNavigate();
  const [isCreateGameOpen, setIsCreateGameOpen] = useState(false);
  const [selectedGameRoomId, setSelectedGameRoomId] = useState<string>();

  const gameRooms = useAppSelector(selectGames);

  useEffect(() => {
    getGames();
  }, []);

  const onCreateGameCancel = () => {
    setIsCreateGameOpen(false);
  };

  const onGameDetailsClosed = () => {
    setSelectedGameRoomId(undefined);
  };

  const onJoinGame = (gameId: string) => {
    try {
      joinGame(gameId);
      navigate(`/game/${gameId}`);
      onGameDetailsClosed();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const onLeaveGame = (gameId: string) => {
    try {
      leaveGame(gameId);
      onGameDetailsClosed();
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const onCreateGameSubmitted = (data: CreateGame) => {
    try {
      createGame(data);
      setIsCreateGameOpen(false);
    } catch (error: any) {
      console.log(error.message);
    }
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
        data-testid="create-game-dialog"
        open={isCreateGameOpen}
        onClose={onCreateGameCancel}
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
