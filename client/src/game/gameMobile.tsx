import { Stack } from "@mui/material";
import { useParams } from "react-router";
import { useAppSelector } from "../redux/hooks";
import { selectActiveGame, selectGame, selectUserId } from "../redux/selectors";
import GameControls from "./gameControls";
import GameOverDialog from "./gameOverDialog";
import InfoBoard from "./infoBoard";
import PlayerArea from "./playerArea";

type GameMobileProps = {};

type RouteParams = {
  id: string;
};

const GameMobile = ({}: GameMobileProps) => {
  const params = useParams<RouteParams>();
  const playerId = useAppSelector(selectUserId);
  const gameRoomId = params.id!;

  const game = useAppSelector(selectActiveGame);
  const gameRoom = useAppSelector((state) => selectGame(state, gameRoomId));

  if (!game || !gameRoom) {
    return <div>{`Unknown game id: '${gameRoomId}'`}</div>;
  }

  const self = gameRoom.players.find((p) => p.id === playerId);
  const opponent = gameRoom.players.find((p) => p.id !== playerId);

  return (
    <Stack data-testid="active-game" direction="column" mt={2} mb={2} spacing={1} >
      <GameOverDialog />
      <Stack spacing={3} direction={"column"}>
        <InfoBoard gameRoomId={gameRoomId} />
        <GameControls
          gameRoomId={gameRoomId}
          playerIds={gameRoom?.players.map((p) => p.id) ?? []}
        />
      </Stack>
      <PlayerArea
        gameId={game.id}
        player1Name={self?.username ?? ""}
        player1Id={self?.id ?? ""}
        player2Name={opponent?.username ?? "-"}
        player2Id={opponent?.id ?? ""}
      />
      <GameOverDialog />
    </Stack>
  );
};

export default GameMobile;
