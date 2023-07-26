import { Stack } from "@mui/material";
import { useParams } from "react-router";
import { useBreakpoint } from "../navigation/useBreakpoint";
import { useAppSelector } from "../redux/hooks";
import { selectActiveGame, selectGame, selectUserId } from "../redux/selectors";
import GameControls from "./gameControls";
import GameMobile from "./gameMobile";
import GameOverDialog from "./gameOverDialog";
import InfoBoard from "./infoBoard";
import PlayerArea from "./playerArea";
import { useGetInitialData } from "./useGetInitialData";

type GameProps = {};

type RouteParams = {
  id: string;
};

const Game = ({}: GameProps) => {
  const params = useParams<RouteParams>();
  const playerId = useAppSelector(selectUserId);
  const gameRoomId = params.id!;

  const game = useAppSelector(selectActiveGame);
  const gameRoom = useAppSelector((state) => selectGame(state, gameRoomId));
  const { sm } = useBreakpoint();

  useGetInitialData();

  if (!game || !gameRoom) {
    return <div>{`Unknown game id: '${gameRoomId}'`}</div>;
  }

  const self = gameRoom.players.find((p) => p.id === playerId);
  const opponent = gameRoom.players.find((p) => p.id !== playerId);

  if (sm) {
    return <GameMobile />;
  }
  return (
    <Stack direction="column" mt={2} data-testid="active-game" spacing={1}>
      <GameOverDialog />
      <InfoBoard gameRoomId={gameRoomId} />
      <PlayerArea
        gameId={game.id}
        player1Name={self?.username ?? ""}
        player1Id={self?.id ?? ""}
        player2Name={opponent?.username ?? "-"}
        player2Id={opponent?.id ?? ""}
      />
      <GameControls
        gameRoomId={gameRoomId}
      />
    </Stack>
  );
};

export default Game;
