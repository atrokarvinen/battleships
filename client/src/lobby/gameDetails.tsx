import CloseIcon from "@mui/icons-material/Close";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import { useApiRequest } from "../api/useApiRequest";
import { deleteGameRoom } from "../redux/gameRoomSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectGame, selectUserId } from "../redux/selectors";
import { deleteGameRequest } from "./api";

type GameDetailsProps = {
  gameId: string | undefined;
  onClose(): void;
  onGo(gameId: string): void;
  onJoin(gameId: string): void;
  onLeave(gameId: string): void;
};

const GameDetails = ({
  gameId,
  onClose,
  onGo,
  onJoin,
  onLeave,
}: GameDetailsProps) => {
  const dispatch = useAppDispatch();
  const { request } = useApiRequest();
  const game = useAppSelector((state) => selectGame(state, gameId));
  const userId = useAppSelector(selectUserId);

  if (!gameId) return <></>;

  if (!game) {
    return (
      <Dialog open onClose={onClose}>
        <DialogTitle>Game not found</DialogTitle>
      </Dialog>
    );
  }

  const onDelete = async (gameId: string) => {
    const response = await request(deleteGameRequest(gameId), true);
    if (!response) return;
    console.log("successfully deleted game " + gameId);
    dispatch(deleteGameRoom(gameId));
    onClose();
  };

  const isGameCreator = userId === game.createdBy;
  const isJoined = game.players.map((p) => p.id).includes(userId!!);
  const isGameFull = game.players.length >= 2;
  const cannotJoin = isJoined || isGameFull;
  const cannotLeave = !isJoined;
  const cannotDelete = !isGameCreator;

  return (
    <Dialog open onClose={onClose} data-testid="game-details-dialog">
      <DialogTitle>
        <Stack direction="row" justifyContent="space-between">
          <span>
            <span>Game</span>
            &nbsp;
            <span>{`'${game.title}'`}</span>
          </span>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent>
        <Stack direction={"column"}>
          <span>{`Joined players: ${game.players
            .map((p) => p.username)
            .join(", ")}`}</span>
          <span>Game mode:</span>
          <span>{`Created: ${new Date(game.createdAt).toLocaleString(
            "fi-FI"
          )}`}</span>
        </Stack>
      </DialogContent>
      <DialogActions>
        {isJoined ? (
          <Button onClick={() => onGo(game.id)} variant="contained">
            Go
          </Button>
        ) : (
          <Button
            disabled={cannotJoin}
            onClick={() => onJoin(game.id)}
            variant="contained"
          >
            Join
          </Button>
        )}
        <Button
          disabled={cannotLeave}
          onClick={() => onLeave(game.id)}
          variant="outlined"
        >
          Leave
        </Button>
        <Button
          disabled={cannotDelete}
          onClick={() => onDelete(game.id)}
          variant="outlined"
        >
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameDetails;
