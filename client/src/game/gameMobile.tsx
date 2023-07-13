import { Stack } from "@mui/material";
import { useContext } from "react";
import { useParams } from "react-router";
import { SocketContext } from "../io/socketProvider";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectActiveGame, selectGame, selectUserId } from "../redux/selectors";
import GameChat from "./gameChat";
import GameControls from "./gameControls";
import GameOverDialog from "./gameOverDialog";
import InfoBoard from "./infoBoard";
import PlayerArea from "./playerArea";

type GameMobileProps = {};

type RouteParams = {
  id: string;
};

const GameMobile = ({}: GameMobileProps) => {
  const dispatch = useAppDispatch();
  const params = useParams<RouteParams>();
  const playerId = useAppSelector(selectUserId);
  const gameRoomId = params.id!;

  const socket = useContext(SocketContext);

  const game = useAppSelector(selectActiveGame);
  const gameRoom = useAppSelector((state) => selectGame(state, gameRoomId));

  if (!game || !gameRoom) {
    return <div>{`Unknown game id: '${gameRoomId}'`}</div>;
  }

  // TODO need to set p1 and p2 in database
  const self = gameRoom.players.find((p) => p.id === playerId);
  const opponent = gameRoom.players.find((p) => p.id !== playerId);

  const playerIds = game.players.map((p) => p.id);

  console.log("[GameMobile]");

  return (
    <Stack direction={"column"} mt={2} data-testid="active-game">
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
      <GameChat gameId={gameRoomId} playerIds={playerIds} />
      <GameOverDialog />
    </Stack>
  );
};

export default GameMobile;
