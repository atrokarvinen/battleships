import { Button } from "@mui/material";
import { useNavigate } from "react-router";
import { login } from "../redux/authSlice";
import { useAppDispatch } from "../redux/hooks";
import { signInAsGuestRequest } from "./api";
import { handleError } from "./errorHandling";

type UnauthorizedProps = {
  unAuthRoute?: string;
};

const Unauthorized = ({ unAuthRoute }: UnauthorizedProps) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleGuestLogin = async () => {
    try {
      const response = await signInAsGuestRequest();
      const { userId, username } = response.data;
      dispatch(login({ userId, username, isGuest: true }));
      navigate(unAuthRoute || "/");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <div>
      <h1>Not authorized, please log in</h1>
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
