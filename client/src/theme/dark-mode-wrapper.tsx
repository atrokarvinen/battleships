import { CssBaseline } from "@mui/material";
import { useColorScheme } from "@mui/material/styles";
import { ReactElement, createContext, useMemo } from "react";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "light",
});

type DarkModeProps = {
  children: ReactElement | ReactElement[];
};

export function DarkModeWrapper({ children }: DarkModeProps) {
  const { mode, setMode } = useColorScheme();
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode(mode === "light" ? "dark" : "light");
      },
      mode: mode === "light" ? "light" : "dark",
    }),
    [mode]
  );

  return (
    <ColorModeContext.Provider value={colorMode}>
      <CssBaseline />
      {children}
    </ColorModeContext.Provider>
  );
}
