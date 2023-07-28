import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import FlagCircle from "@mui/icons-material/FlagCircle";
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Link as MuiLink,
  Toolbar,
} from "@mui/material";
import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { handleError } from "../api/errorHandling";
import { signOutRequest } from "../auth/api";
import { ColorModeContext } from "../dark-mode-wrapper";
import Profile from "../lobby/profile";
import { logout as logoutUser } from "../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectIsLoggedIn } from "../redux/selectors";
import NavigationMobile from "./navigationMobile";
import { useBreakpoint } from "./useBreakpoint";

type NavigationProps = {};

const Navigation = ({}: NavigationProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const breakpoints = useBreakpoint();
  const colorMode = useContext(ColorModeContext);

  const isAuth = useAppSelector(selectIsLoggedIn);

  // console.log("colorMode.mode:", colorMode.mode);

  const logout = async () => {
    try {
      await signOutRequest();
      navigate("/");
      dispatch(logoutUser());
    } catch (error) {
      handleError(error);
    }
  };

  if (breakpoints.sm) {
    return <NavigationMobile />;
  }
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
