import { Dialog, DialogTitle } from "@mui/material";
import { useApiRequest } from "../../api/useApiRequest";
import { deleteGameRoom } from "../../redux/gameRoomSlice";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { selectGame, selectUserId } from "../../redux/selectors";
import { deleteGameRequest } from "../api/api";
import { Actions } from "./actions";
import { Content } from "./content";
import { Title } from "./title";

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
    console.log("successfully deleted game '%s'", game.title);
    dispatch(deleteGameRoom(gameId));
    onClose();
  };

  return (
    <Dialog open onClose={onClose} data-testid="game-details-dialog">
      <Title title={game.title} onClose={onClose} />
      <Content game={game} />
      <Actions
        game={game}
        userId={userId!}
        onGo={onGo}
        onJoin={onJoin}
        onLeave={onLeave}
        onDelete={onDelete}
      />
    </Dialog>
  );
};

export default GameDetails;
