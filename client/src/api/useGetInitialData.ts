import { useEffect } from "react";
import { getAllPlayersRequest } from "../lobby/api";
import { useAppDispatch } from "../redux/hooks";
import { addPlayers } from "../redux/playerSlice";
import { handleError } from "./errorHandling";

export const useGetInitialData = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchPlayers();
  }, []);

  const fetchPlayers = async () => {
    try {
      const response = await getAllPlayersRequest();
      const players = response.data;
      dispatch(addPlayers(players));
    } catch (error) {
      handleError(error);
    }
  };
};
