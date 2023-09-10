import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useEffect } from "react";
import { useApiRequest } from "../api/useApiRequest";
import { closeGameOverDialog, setPlayerShips } from "../redux/activeGameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectActiveGameId,
  selectShowGameOverDialog,
  selectWinnerPlayer,
} from "../redux/selectors";
import { getOpponentShips } from "./api/api";
import { ShipRevealPayload } from "./api/apiModel";

type GameOverDialogProps = {};

const GameOverDialog = ({}: GameOverDialogProps) => {
  const { request } = useApiRequest();
  const dispatch = useAppDispatch();

  const isOpen = useAppSelector(selectShowGameOverDialog);
  const winner = useAppSelector(selectWinnerPlayer);
  const gameId = useAppSelector(selectActiveGameId);

  useEffect(() => {
    if (isOpen) {
      revealOpponentShips();
    }
  }, [isOpen, gameId]);

  const revealOpponentShips = async () => {
    const response = await request(getOpponentShips(gameId));
    if (!response) return;
    const payload: ShipRevealPayload = response.data;
    dispatch(setPlayerShips(payload));
  };

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
