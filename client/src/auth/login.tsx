import styles from "./styles.module.scss";
import { Box, Button, Dialog, DialogContent, DialogTitle } from "@mui/material";
import { useState } from "react";
import SignIn from "./signIn";
import SignUp from "./signUp";
import { SignUpForm } from "./singUpForm";
import { signInRequest, signUpRequest } from "./api";
import { LoginForm } from "./loginForm";
import { useNavigate } from "react-router";
import { useAppDispatch } from "../redux/hooks";
import { addPlayer } from "../redux/playerSlice";
import { FormErrorMap } from "./models";
import { FormError, handleError } from "./errorHandling";
import { login } from "../redux/authSlice";

type LoginProps = {};

const Login = ({}: LoginProps) => {
  const [isSignUpOpen, setIsSignUpOpen] = useState(false);
  const [testCreatedUser, setTestCreatedUser] = useState<LoginForm>();
  const [signUpErrors, setSignUpErrors] = useState<FormErrorMap>({});
  const [signInError, setSignInError] = useState("");

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

      const { userId, username } = response.data;
      dispatch(
        addPlayer({
          id: userId,
          username: username,
          gamesJoined: response.data.gamesJoined,
        })
      );
      dispatch(login({ userId, username }));

      navigate("/lobby");
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

  return (
    <Box className={styles.login}>
      <SignIn
        defaultValues={testCreatedUser}
        onSubmit={handleSignInSubmit}
        error={signInError}
      />
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
          <SignUp
            onCancel={closeSignUpForm}
            onSubmit={handleSignUpSubmit}
            errors={signUpErrors}
          />
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Login;
