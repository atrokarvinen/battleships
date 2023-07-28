import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { IconButton } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext } from "./dark-mode-wrapper";

type DarkModeButtonProps = {};

const DarkModeButton = ({}: DarkModeButtonProps) => {
  const colorMode = useContext(ColorModeContext);

  return (
    <IconButton
      sx={{ ml: 1 }}
      onClick={colorMode.toggleColorMode}
      color="inherit"
    >
      {colorMode.mode === "dark" ? (
        <Brightness7Icon fontSize="large" />
      ) : (
        <Brightness4Icon fontSize="large" />
      )}
    </IconButton>
  );
};

export default DarkModeButton;
