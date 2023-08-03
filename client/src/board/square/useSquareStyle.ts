import { useTheme } from "@mui/material";

export const useSquareStyle = () => {
  const theme = useTheme();

  const border = {
    border: 1,
    borderColor: theme.palette.text.primary,
  };

  return { border };
};
