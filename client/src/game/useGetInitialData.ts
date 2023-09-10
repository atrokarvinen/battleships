import { useContext, useEffect } from "react";
import { useParams } from "react-router";
import { handleError } from "../api/errorHandling";
import { SocketContext } from "../io/socketProvider";
import { getGameRequest } from "../lobby/api/api";
import { GameRoom } from "../lobby/gameRoom";
import { setActiveGame } from "../redux/activeGameSlice";
import { addNewGameRoom } from "../redux/gameRoomSlice";
import { useAppDispatch } from "../redux/hooks";
import { getGameByRoomIdRequest, mapGameDtoToActiveGame } from "./api/api";
import { GameDTO } from "./api/apiModel";

export const useGetInitialData = () => {
  const dispatch = useAppDispatch();
  const socket = useContext(SocketContext);

  const params = useParams();
  const gameRoomId = params.id;

  useEffect(() => {
    fetchGame();
    fetchGameRoom();
  }, []);

  const fetchGame = async () => {
    if (!gameRoomId) return;
    try {
      const response = await getGameByRoomIdRequest(gameRoomId);
      const fetchedGame: GameDTO = response.data;
      const activeGame = mapGameDtoToActiveGame(fetchedGame);
      console.log("fetched activeGame:", activeGame);
      dispatch(setActiveGame(activeGame));
      socket.emit("joinRoom", gameRoomId);
    } catch (error) {
      handleError(error);
    }
  };

  const fetchGameRoom = async () => {
    if (!gameRoomId) return;

    try {
      const response = await getGameRequest(gameRoomId);
      const fetchedGameRoom: GameRoom = response.data;
      console.log("fetched game room:", fetchedGameRoom);
      dispatch(addNewGameRoom(fetchedGameRoom));
    } catch (error) {
      handleError(error);
    }
  };
};
