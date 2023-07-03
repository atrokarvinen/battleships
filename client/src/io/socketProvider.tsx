import { ReactElement, createContext, useEffect } from "react";
import { io } from "socket.io-client";
import { mapGameDtoToActiveGame } from "../game/api";
import { GameDTO } from "../game/apiModel";
import {
  missShip,
  openGameOverDialog,
  setActiveGame,
  setIsGameOver,
  setWinnerPlayerId,
  sinkShip,
  swapPlayerIdToPlay,
} from "../redux/activeGameSlice";
import { addMessage } from "../redux/chatSlice";
import {
  addNewGameRoom,
  deleteGameRoom,
  joinGame,
  leaveGame,
} from "../redux/gameRoomSlice";
import { useAppDispatch } from "../redux/hooks";
import {
  Player,
  addPlayerToGame,
  removePlayerFromGame,
} from "../redux/playerSlice";

type SocketProviderProps = { children: ReactElement };

console.log("Connecting socket...");

const socket = io("ws://localhost:3001", { autoConnect: true });
export const SocketContext = createContext(socket);

export type GamePlayerChangedPayload = {
  gameId: string;
  playerId: string;
  player?: Player;
};

const SocketProvider = ({ children }: SocketProviderProps) => {
  const dispatch = useAppDispatch();

  console.log("[Socket provider] renders");

  useEffect(() => {
    unSubscribeEvents();
    subscribeEvents();
    return () => {
      unSubscribeEvents();
    };
  }, []);

  function subscribeEvents() {
    console.log("subscribing events... socket:", socket.id);

    socket.on("connection", () => {
      console.log("connected socket");
    });
    socket.on("helloFromServer", () => {
      console.log("hello from server");
    });
    socket.on("chatMessageToClient", (message) => {
      console.log("message from server:", message);
      dispatch(addMessage(message));
    });

    // Game room
    socket.on("gameCreated", (game) => {
      console.log(`Game ${JSON.stringify(game)} created`);
      dispatch(addNewGameRoom(game));
    });
    socket.on("gameDeleted", (gameId) => {
      console.log(`Game '${gameId}' deleted`);
      dispatch(deleteGameRoom(gameId));
    });
    socket.on("gameJoined", (payload: GamePlayerChangedPayload) => {
      const { gameId, playerId } = payload;
      console.log(`Player ${playerId} joined game ${gameId}`);
      dispatch(joinGame(payload));
      dispatch(addPlayerToGame(payload));
    });
    socket.on("gameLeft", (payload: GamePlayerChangedPayload) => {
      const { gameId, playerId } = payload;
      console.log(`Player ${playerId} left game ${gameId}`);
      dispatch(leaveGame(payload));
      dispatch(removePlayerFromGame(payload));
    });

    // Game
    socket.on("gameStarted", (game) => {
      console.log("[Socket client] game started:", game);
      const startedGame: GameDTO = game;
      const activeGame = mapGameDtoToActiveGame(startedGame);
      dispatch(setActiveGame(activeGame));
    });
    socket.on("squareAttacked", (attackResult) => {
      console.log("[Socket client] square attacked:", attackResult);
      const { hasShip, isGameOver, point, playerId } = attackResult;
      if (hasShip) {
        dispatch(sinkShip({ point, attackerPlayerId: playerId }));
        console.log("ship sunk, player gets a new turn");
        if (isGameOver) {
          console.log("game over. Winner:", playerId);
          dispatch(setIsGameOver(true));
          dispatch(openGameOverDialog());
          dispatch(setWinnerPlayerId(playerId));
        }
      } else {
        dispatch(missShip({ point, attackerPlayerId: playerId }));
        dispatch(swapPlayerIdToPlay());
        console.log("miss, player turn changes");
      }
    });
  }

  function unSubscribeEvents() {
    console.log("unsubscribing events...");

    socket.off("gameCreated");
    socket.off("gameDeleted");
    socket.off("allGamesDeleted");
    socket.off("gameJoined");
    socket.off("gameLeft");
  }

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export default SocketProvider;
