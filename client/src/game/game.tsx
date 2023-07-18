import { Stack } from "@mui/material";
import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { handleError } from "../api/errorHandling";
import { SocketContext } from "../io/socketProvider";
import { getGameRequest } from "../lobby/api";
import { GameRoom } from "../lobby/gameRoom";
import { useBreakpoint } from "../navigation/useBreakpoint";
import { setActiveGame } from "../redux/activeGameSlice";
import { addNewGameRoom } from "../redux/gameRoomSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addPlayer } from "../redux/playerSlice";
import { selectActiveGame, selectGame, selectUserId } from "../redux/selectors";
import { getGameByRoomIdRequest, mapGameDtoToActiveGame } from "./api";
import { GameDTO } from "./apiModel";
import GameControls from "./gameControls";
import GameMobile from "./gameMobile";
import GameOverDialog from "./gameOverDialog";
import InfoBoard from "./infoBoard";
import PlayerArea from "./playerArea";

type GameProps = {};

type RouteParams = {
  id: string;
};

const Game = ({}: GameProps) => {
  const dispatch = useAppDispatch();
  const params = useParams<RouteParams>();
  const playerId = useAppSelector(selectUserId);
  const gameRoomId = params.id!;

  const socket = useContext(SocketContext);

  const game = useAppSelector(selectActiveGame);
  const gameRoom = useAppSelector((state) => selectGame(state, gameRoomId));
  const { sm } = useBreakpoint();

  useEffect(() => {
    fetchGame();
    fetchGameRoom();
  }, []);

  const fetchGame = async () => {
    try {
      const response = await getGameByRoomIdRequest(gameRoomId);
      const fetchedGame: GameDTO = response.data;
      const activeGame = mapGameDtoToActiveGame(fetchedGame);
      console.log("fetchedGame:", fetchedGame);
      console.log("activeGame:", activeGame);
      dispatch(setActiveGame(activeGame));
      socket.emit("joinRoom", gameRoomId);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchGameRoom = async () => {
    try {
      const response = await getGameRequest(gameRoomId);
      const fetchedGameRoom: GameRoom = response.data;
      console.log("fetched game room:", fetchedGameRoom);
      dispatch(addNewGameRoom(fetchedGameRoom));
      fetchedGameRoom.players.forEach((p) => {
        dispatch(addPlayer(p));
      });
    } catch (error) {
      handleError(error);
    }
  };

  if (!game || !gameRoom) {
    return <div>{`Unknown game id: '${gameRoomId}'`}</div>;
  }

  // TODO need to set p1 and p2 in database
  const self = gameRoom.players.find((p) => p.id === playerId);
  const opponent = gameRoom.players.find((p) => p.id !== playerId);

  const playerIds = game.players.map((p) => p.id);

  // console.log("playerId:", playerId);
  // console.log("self:", self);

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
        playerIds={gameRoom?.players.map((p) => p.id) ?? []}
      />
      {/* <GameChat gameId={gameRoomId} playerIds={playerIds} /> */}
    </Stack>
  );
};

export default Game;
