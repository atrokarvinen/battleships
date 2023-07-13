import { FormControlLabel, Switch } from "@mui/material";
import { useState } from "react";

type RevealOpponentBoardProps = {};

const RevealOpponentBoard = ({}: RevealOpponentBoardProps) => {
  const showOpponentInitialValue = false;
  const [showOpponent, setShowOpponent] = useState(showOpponentInitialValue);

  return (
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
  );
};

export default RevealOpponentBoard;
