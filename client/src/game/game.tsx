import { Box, FormControlLabel, Stack, Switch } from "@mui/material";
import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router";
import { handleError } from "../api/errorHandling";
import { SocketContext } from "../io/socketProvider";
import { getGameRequest } from "../lobby/api";
import { GameRoom } from "../lobby/gameRoom";
import { setActiveGame } from "../redux/activeGameSlice";
import { addNewGameRoom } from "../redux/gameRoomSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addPlayer } from "../redux/playerSlice";
import { selectActiveGame, selectGame, selectUserId } from "../redux/selectors";
import { getGameByRoomIdRequest, mapGameDtoToActiveGame } from "./api";
import { GameDTO } from "./apiModel";
import GameChat from "./gameChat";
import GameControls from "./gameControls";
import GameOverDialog from "./gameOverDialog";
import InfoBoard from "./infoBoard";
import PlayerArea from "./playerArea";
import styles from "./styles.module.scss";

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

  const showOpponentInitialValue = false;
  const [showOpponent, setShowOpponent] = useState(showOpponentInitialValue);

  const game = useAppSelector(selectActiveGame);
  const gameRoom = useAppSelector((state) => selectGame(state, gameRoomId));

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
        name={self?.username ?? ""}
        playerId={self?.id ?? ""}
      />
      <div style={{ margin: 10 }}></div>
      <Stack direction={"column"}>
        <FormControlLabel
          control={
            <Switch
              defaultChecked={showOpponentInitialValue}
              value={showOpponent}
              onChange={(e) => setShowOpponent(e.target.checked)}
            />
          }
          label="Show opponent board"
        />
        {showOpponent && (
          <PlayerArea
            gameId={game.id}
            name={opponent?.username ?? ""}
            playerId={opponent?.id ?? "1"}
          />
        )}
      </Stack>
      <GameChat gameId={gameRoomId} playerIds={playerIds} />
      <GameOverDialog />
    </Box>
  );
};

export default Game;
