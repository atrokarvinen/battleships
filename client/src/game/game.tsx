import { useParams } from "react-router";
import { useBreakpoint } from "../navigation/useBreakpoint";
import { useAppSelector } from "../redux/hooks";
import {
  selectActiveGameId,
  selectGame,
  selectUserId,
} from "../redux/selectors";
import GameControls from "./gameControls";
import { useAiPlayer } from "./hooks/useAiPlayer";
import { useRoomSocket } from "./hooks/useRoomSocket";
import InfoBoard from "./infoBoard";
import DesktopLayout from "./layout/desktopLayout";
import { LayoutProps } from "./layout/layoutProps";
import MobileLayout from "./layout/mobileLayout";
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

  const gameId = useAppSelector(selectActiveGameId);
  const gameRoom = useAppSelector((state) => selectGame(state, gameRoomId));
  const { sm } = useBreakpoint();

  useGetInitialData();
  useRoomSocket(gameRoomId);
  useAiPlayer(gameRoomId);

  if (!gameId || !gameRoom) {
    return <div>{`Unknown game id: '${gameRoomId}'`}</div>;
  }

  const self = gameRoom.players.find((p) => p.id === playerId);
  const opponent = gameRoom.players.find((p) => p.id !== playerId);

  const props: LayoutProps = {
    GameControls: <GameControls gameRoomId={gameRoomId} />,
    InfoBoard: <InfoBoard gameRoomId={gameRoomId} />,
    PlayerArea: (
      <PlayerArea
        gameId={gameId}
        player1Name={self?.username ?? ""}
        player1Id={self?.id ?? ""}
        player2Name={opponent?.username ?? "-"}
        player2Id={opponent?.id ?? ""}
      />
    ),
  };
  if (sm) {
    return <MobileLayout {...props} />;
  }
  return <DesktopLayout {...props} />;
};

export default Game;
