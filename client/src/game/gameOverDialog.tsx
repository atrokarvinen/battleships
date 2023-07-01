import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { closeGameOverDialog } from "../redux/activeGameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectShowGameOverDialog,
  selectWinnerPlayer,
} from "../redux/selectors";

type GameOverDialogProps = {};

const GameOverDialog = ({}: GameOverDialogProps) => {
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(selectShowGameOverDialog);
  const winner = useAppSelector(selectWinnerPlayer);

  const onClose = () => {
    dispatch(closeGameOverDialog());
  };

  return (
    <Dialog data-testid="game-over-dialog" open={isOpen} onClose={onClose}>
      <DialogTitle>Game over</DialogTitle>
      <DialogContent>{`Game is over. Player '${winner?.username}' won!`}</DialogContent>
      <DialogActions>
        <Button onClick={onClose} variant="contained">
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GameOverDialog;
