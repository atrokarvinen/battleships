import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router";
import { handleError } from "../api/errorHandling";
import { FormError } from "../api/formError";
import { FormErrorMap } from "../api/models";
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
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [testCreatedUser, setTestCreatedUser] = useState<LoginForm>();
  const [signUpErrors, setSignUpErrors] = useState<FormErrorMap>({});
  const [signInError, setSignInError] = useState("");

  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  function openSignUpForm() {
    resetSignUpErrors();
    setIsSignUpOpen(true);
  }

  function closeSignUpForm() {
    setIsSignUpOpen(false);
    resetSignUpErrors();
  }

  function resetSignUpErrors() {
    setSignUpErrors({});
  }

  async function handleSignInSubmit(data: LoginForm) {
    console.log("submitted login: " + JSON.stringify(data));
    try {
      const response = await signInRequest(data);
      console.log(`sign in response data:`, response.data);

      const { userId, username, gamesJoined } = response.data;
      dispatch(addPlayer({ id: userId, username, gamesJoined }));
      dispatch(login({ userId, username, isGuest: false }));

      const redirectUrl = location.state?.deniedRoute ?? "/lobby";
      navigate(redirectUrl);
    } catch (error) {
      handleSignInError(error);
    }
  }

  const handleSignInError = (error: any) => {
    const message = handleError(error);
    if (typeof message === "string") {
      setSignInError(message);
    }
  };

  async function handleSignUpSubmit(data: SignUpForm) {
    console.log(`sign up data: ${JSON.stringify(data)}`);
    try {
      const response = await signUpRequest(data);
      console.log(`sign up response: ${response.status}`);
      setTestCreatedUser({ ...data });
      setIsSignUpOpen(false);
      resetSignUpErrors();
    } catch (error) {
      handleSignUpError(error);
    }
  }

  const handleSignUpError = (error: any) => {
    const message = handleError(error);
    if (message instanceof FormError) {
      setSignUpErrors(message.errors);
    }
  };

  const handleGuestLogin = async () => {
    try {
      const response = await signInAsGuestRequest();
      const { userId, username } = response.data;
      dispatch(login({ userId, username, isGuest: true }));
      navigate("/lobby");
    } catch (error) {
      handleError(error);
    }
  };

  return (
    <Box className={styles.login}>
      <SignIn
        defaultValues={testCreatedUser}
        onSubmit={handleSignInSubmit}
        error={signInError}
      />
      <Button
        onClick={handleGuestLogin}
        variant="outlined"
        sx={{ width: "150px", mt: 1 }}
      >
        Guest login
      </Button>
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
            <SignUp
              onCancel={closeSignUpForm}
              onSubmit={handleSignUpSubmit}
              errors={signUpErrors}
            />
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Login;
