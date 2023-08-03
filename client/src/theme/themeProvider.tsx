import { Experimental_CssVarsProvider as CssVarsProvider } from "@mui/material/styles";
import { ReactElement } from "react";
import { DarkModeWrapper } from "./dark-mode-wrapper";

type ThemeProviderProps = {
  children: ReactElement | ReactElement[];
};

const ThemeProvider = ({ children }: ThemeProviderProps) => {
  return (
    <CssVarsProvider>
      <DarkModeWrapper>{children}</DarkModeWrapper>
    </CssVarsProvider>
  );
};

export default ThemeProvider;
