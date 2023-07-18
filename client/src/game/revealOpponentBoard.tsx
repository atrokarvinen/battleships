import { FormControlLabel, Switch } from "@mui/material";
import { handleError } from "../api/errorHandling";
import {
  resetOpponentShipLocations,
  setOpponentShipLocations,
  setShowOpponentBoard,
} from "../redux/activeGameSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectShowOpponentShips } from "../redux/selectors";
import { getOpponentShipLocationsRequest, mapSquaresToBoardPoint } from "./api";

type RevealOpponentBoardProps = { opponentId: string; gameId: string };

const RevealOpponentBoard = ({
  opponentId,
  gameId,
}: RevealOpponentBoardProps) => {
  const dispatch = useAppDispatch();
  const showOpponentShips = useAppSelector(selectShowOpponentShips);

  const setShowOpponentShips = (value: boolean) => {
    if (value) {
      requestOpponentShipLocations();
    } else {
      dispatch(resetOpponentShipLocations(opponentId));
    }
    dispatch(setShowOpponentBoard(value));
  };

  const requestOpponentShipLocations = async () => {
    try {
      const response = await getOpponentShipLocationsRequest(
        gameId,
        opponentId
      );
      const opponentShipLocations = response.data;
      const mappedLocations = mapSquaresToBoardPoint(opponentShipLocations);
      console.log("mappedLocations:", mappedLocations);
      dispatch(
        setOpponentShipLocations({
          playerId: opponentId,
          points: mappedLocations,
        })
      );
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <FormControlLabel
      control={
        <Switch
          value={showOpponentShips}
          onChange={(e) => setShowOpponentShips(e.target.checked)}
        />
      }
      label="Show opponent board"
    />
  );
};

export default RevealOpponentBoard;
