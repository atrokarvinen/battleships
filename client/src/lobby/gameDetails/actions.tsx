import { Button, DialogActions } from "@mui/material";
import { GameRoom } from "../gameRoom";

type ActionsProps = {
  game: GameRoom;
  userId: string;
  onGo(gameId: string): void;
  onJoin(gameId: string): void;
  onLeave(gameId: string): void;
  onDelete(gameId: string): void;
};

const Actions = ({
  game,
  userId,
  onGo,
  onJoin,
  onLeave,
  onDelete,
}: ActionsProps) => {
  const isGameCreator = userId === game.createdBy;
  const isJoined = game.players.map((p) => p.id).includes(userId);
  const isGameFull = game.players.length >= 2;
  const cannotJoin = isJoined || isGameFull;
  const cannotLeave = !isJoined;
  const cannotDelete = !isGameCreator;

  return (
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
  );
};

export { Actions };
