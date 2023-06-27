// import { AppBar, Button, Link, Toolbar } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../auth/useAuth";
import {
  AppBar,
  Button,
  Toolbar,
  Link as MuiLink,
  Box,
  Grid,
  IconButton,
} from "@mui/material";
import FlagCircle from "@mui/icons-material/FlagCircle";
import SettingsIcon from "@mui/icons-material/Settings";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useContext } from "react";
import { ColorModeContext } from "../dark-mode-wrapper";
import Profile from "../lobby/profile";

type NavigationProps = {};

const Navigation = ({}: NavigationProps) => {
  const navigate = useNavigate();
  const { isAuth, logout } = useAuth();
  const colorMode = useContext(ColorModeContext);

  // console.log("colorMode.mode:", colorMode.mode);

  return (
    <AppBar position="static">
      <Toolbar>
        <Grid container>
          <Grid item xs={2} alignItems="center" display="flex">
            <IconButton color="inherit">
              <MuiLink
                component={Link}
                color="inherit"
                underline="none"
                to="/lobby"
                alignItems="center"
                display="flex"
              >
                <FlagCircle sx={{ mr: 1 }} fontSize="large" />
                <span>Battleships app</span>
              </MuiLink>
            </IconButton>
          </Grid>

          <Grid
            item
            display="flex"
            justifyContent="flex-end"
            alignItems="center"
            xs={10}
          >
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
            <SettingsIcon fontSize="large" sx={{ mr: 2 }} />
            {isAuth && (
              <>
                <Profile />
                <Button
                  onClick={logout}
                  color="inherit"
                  variant="outlined"
                  sx={{ ml: 2 }}
                >
                  Logout
                </Button>
              </>
            )}
          </Grid>
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default Navigation;
