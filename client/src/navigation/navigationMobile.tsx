import FlagCircle from "@mui/icons-material/FlagCircle";
import {
  AppBar,
  Button,
  Grid,
  IconButton,
  Link as MuiLink,
  Toolbar,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { handleError } from "../api/errorHandling";
import { signOutRequest } from "../auth/api";
import { logout as logoutUser } from "../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { selectIsLoggedIn } from "../redux/selectors";
import DarkModeButton from "../theme/dark-mode-button";

type NavigationMobileProps = {};

const NavigationMobile = ({}: NavigationMobileProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

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

  return (
    <AppBar position="static">
      <Toolbar sx={{ justifyContent: "space-between" }}>
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
          </MuiLink>
        </IconButton>
        <Grid
          item
          display="flex"
          justifyContent="flex-end"
          alignItems="center"
          xs={10}
        >
          <DarkModeButton/>
          {isAuth && (
            <Button
              onClick={logout}
              color="inherit"
              variant="outlined"
              sx={{ ml: 2 }}
            >
              Logout
            </Button>
          )}
        </Grid>
      </Toolbar>
    </AppBar>
  );
};

export default NavigationMobile;
