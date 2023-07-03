import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { handleError } from "../api/errorHandling";
import { login } from "../redux/authSlice";
import { useAppDispatch } from "../redux/hooks";
import { signInAsGuestRequest } from "./api";

type UnauthorizedProps = {
  deniedRoute?: string;
};

const Unauthorized = ({ deniedRoute }: UnauthorizedProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGuestLogin = async () => {
    try {
      const response = await signInAsGuestRequest();
      const { userId, username } = response.data;
      dispatch(login({ userId, username, isGuest: true }));
      navigate(deniedRoute || "/");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <h1>Not authorized, please log in</h1>
      {/* TODO add denied route to passed state and redirect there after login */}
      <Button onClick={() => navigate("/")} variant="contained">
        Login
      </Button>
      <Button onClick={handleGuestLogin} variant="outlined">
        Login as Guest
      </Button>
    </div>
  );
};

export default Unauthorized;
