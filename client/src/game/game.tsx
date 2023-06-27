import { useParams } from "react-router";
import GameControls from "./gameControls";
import InfoBoard from "./infoBoard";
import PlayerArea from "./playerArea";
import styles from "./styles.module.scss";
import GameChat from "./gameChat";
import { useContext, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { getGameRequest } from "../lobby/api";
import { handleError } from "../auth/errorHandling";
import { Box, Stack } from "@mui/material";
import { SocketContext } from "../io/socketProvider";
import { setActiveGame } from "../redux/activeGameSlice";
import { selectActiveGame, selectGame } from "../redux/selectors";
import { getGameByRoomIdRequest, mapGameDtoToActiveGame } from "./api";
import { GameDTO } from "./apiModel";
import { addNewGameRoom } from "../redux/gameRoomSlice";
import GameOverDialog from "./gameOverDialog";
import { addPlayer } from "../redux/playerSlice";
import { GameRoom } from "../lobby/gameRoom";

type GameProps = {};

type RouteParams = {
  id: string;
};

const Game = ({}: GameProps) => {
  const dispatch = useAppDispatch();
  const params = useParams<RouteParams>();
  const gameRoomId = params.id!;

  const socket = useContext(SocketContext);

  const game = useAppSelector(selectActiveGame);
  const gameRoom = useAppSelector((state) => selectGame(state, gameRoomId));

  useEffect(() => {
    fetchGame();
    fetchGameRoom();
  }, []);

  const fetchGame = async () => {
    try {
      const response = await getGameByRoomIdRequest(gameRoomId);
      const fetchedGame: GameDTO = response.data.game;
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

  const playerIds = game.players.map((p) => p.id);
  const player1 = gameRoom.players.length > 0 ? gameRoom.players[0] : undefined;
  const player2 = gameRoom.players.length > 1 ? gameRoom.players[1] : undefined;

  // console.log("player1:", player1);
  // console.log("player2:", player2);

  return (
    <Box className={styles.game} mt={2} data-testid="active-game">
      <Stack spacing={3} minWidth={300}>
        <InfoBoard gameRoomId={gameRoomId} />
        <GameControls
          gameRoomId={gameRoomId}
          playerIds={gameRoom?.players.map((p) => p.id) ?? []}
        />
      </Stack>
      <PlayerArea
        gameId={game.id}
        name={player1?.username ?? ""}
        playerId={player1?.id ?? "1"}
      />
      <div style={{ margin: 10 }}></div>
      <PlayerArea
        gameId={game.id}
        name={player2?.username ?? ""}
        playerId={player2?.id ?? "2"}
      />
      <GameChat gameId={gameRoomId} playerIds={playerIds} />
      <GameOverDialog />
    </Box>
  );
};

export default Game;
