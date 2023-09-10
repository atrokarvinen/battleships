import FlagCircle from "@mui/icons-material/FlagCircle";
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Link as MuiLink,
  Toolbar,
} from "@mui/material";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import { handleError } from "../api/errorHandling";
import { signOutRequest } from "../auth/api";
import { logout as logoutUser } from "../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectIsLoggedIn } from "../redux/selectors";
import DarkModeButton from "../theme/dark-mode-button";
import NavigationMobile from "./navigationMobile";
import Profile from "./profile";
import { useBreakpoint } from "./useBreakpoint";

type NavigationProps = {};

const Navigation = ({}: NavigationProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const breakpoints = useBreakpoint();

  const isAuth = useAppSelector(selectIsLoggedIn);

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
                component={RouterLink}
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
            <DarkModeButton />
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
