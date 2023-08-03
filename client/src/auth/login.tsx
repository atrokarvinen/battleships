import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { useApiRequest } from "../api/useApiRequest";
import { login } from "../redux/authSlice";
import { useAppDispatch } from "../redux/hooks";
import { addPlayer } from "../redux/playerSlice";
import { signInAsGuestRequest, signInRequest, signUpRequest } from "./api";
import { LoginForm } from "./loginForm";
import SignIn from "./signIn";
import SignUp from "./signUp";
import { SignUpForm } from "./singUpForm";
import styles from "./styles.module.scss";

type LoginProps = {};

const Login = ({}: LoginProps) => {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { request } = useApiRequest();

  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [createdUser, setCreatedUser] = useState<LoginForm>();

  function openSignUpForm() {
    setIsSignUpOpen(true);
  }

  function closeSignUpForm() {
    setIsSignUpOpen(false);
  }

  async function handleSignInSubmit(data: LoginForm) {
    const response = await request(signInRequest(data), true);
    if (!response) return;
    const { userId, username, gamesJoined } = response.data;
    dispatch(addPlayer({ id: userId, username, gamesJoined }));
    dispatch(login({ userId, username, isGuest: false }));

    const redirectUrl = location.state?.deniedRoute ?? "/lobby";
    navigate(redirectUrl);
  }

  async function handleSignUpSubmit(data: SignUpForm) {
    const response = await request(signUpRequest(data), true);
    if (!response) return;
    setCreatedUser({ username: data.username, password: data.password });
    closeSignUpForm();
  }

  const handleGuestLogin = async () => {
    const response = await request(signInAsGuestRequest(), true);
    if (!response) return;
    const { userId, username } = response.data;
    dispatch(login({ userId, username, isGuest: true }));
    navigate("/lobby");
  };

  return (
    <Box className={styles.login}>
      <SignIn defaultValues={createdUser} onSubmit={handleSignInSubmit} />
      {process.env.NODE_ENV === "development" && (
        <Button
          onClick={handleGuestLogin}
          variant="outlined"
          sx={{ width: "150px", mt: 1 }}
        >
          Guest login
        </Button>
      )}
      <Button
        onClick={openSignUpForm}
        variant="outlined"
        sx={{ width: "150px", mt: 1 }}
      >
        Sign up
      </Button>
      <Dialog
        open={isSignUpOpen}
        onClose={closeSignUpForm}
        data-testid="sign-up-dialog"
      >
        <DialogTitle>Sign up</DialogTitle>
        <DialogContent>
          <Box pt={1} pb={1}>
            <SignUp onCancel={closeSignUpForm} onSubmit={handleSignUpSubmit} />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Login;
