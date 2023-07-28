import { ThemeProvider } from "@emotion/react";
import { CssBaseline, createTheme, useMediaQuery } from "@mui/material";
import { useState, useMemo, createContext, ReactElement } from "react";

export const ColorModeContext = createContext({
  toggleColorMode: () => {},
  mode: "light",
});

type DarkModeProps = {
  children: ReactElement | ReactElement[];
};

export function DarkModeWrapper({ children }: DarkModeProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [mode, setMode] = useState<"light" | "dark">("light");
  const colorMode = useMemo(
    () => ({
      toggleColorMode: () => {
        setMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
      },
      mode: mode,
    }),
    [mode]
  );

  const theme = useMemo(() => {
    // console.log("mode changed, changing theme...");
    return createTheme({
      palette: {
        mode,
      },
    });
  }, [mode]);

  // console.log("prefers dark mode:", prefersDarkMode);

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
