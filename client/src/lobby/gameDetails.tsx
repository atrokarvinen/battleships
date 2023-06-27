import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
} from "@mui/material";
import styles from "./styles.module.scss";
import { useSelector } from "react-redux";
import { useAppSelector } from "../redux/hooks";
import {
  selectGame,
  selectGames,
  selectUserId,
  selectUsername,
} from "../redux/selectors";
import { deleteGameRequest } from "./api";
import { handleError } from "../auth/errorHandling";
import CloseIcon from "@mui/icons-material/Close";

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
    try {
      await deleteGameRequest(gameId);
      console.log("successfully deleted game " + gameId);
      onClose();
    } catch (error) {
      handleError(error);
    }
  };

  const isGameCreator = userId === userId;
  const isJoined = game.players.map((p) => p.id).includes(userId!!);
  const isGameFull = game.players.length >= 2;
  const cannotJoin = isJoined || isGameFull;
  const cannotLeave = !isJoined;
  const cannotDelete = !isGameCreator;

  return (
    <Dialog open onClose={onClose} data-testid="game-details-dialog">
      <DialogTitle>
        <span>Game</span>
        &nbsp;
        <span>{`'${game.title}'`}</span>
        <IconButton
          onClick={onClose}
          sx={{ position: "absolute", right: 16, top: 16 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent>
        <Stack direction={"column"}>
          <span>Joined players:</span>
          <span>Game mode:</span>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button
          disabled={!isJoined}
          onClick={() => onGo(game.id)}
          variant="contained"
        >
          Go
        </Button>
        <Button
          disabled={cannotJoin}
          onClick={() => onJoin(game.id)}
          variant="contained"
        >
          Join
        </Button>
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
