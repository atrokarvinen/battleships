import { yupResolver } from "@hookform/resolvers/yup";
import { Box, Button, TextField } from "@mui/material";
import { FormEvent, useEffect, useRef } from "react";
import { useForm } from "react-hook-form";
import { FormErrorMap } from "../api/models";
import { schema } from "./signUpValidation";
import { SignUpForm } from "./singUpForm";

export type SignUpProps = {
  onCancel(): void;
  onSubmit(data: SignUpForm): void;
  errors: FormErrorMap;
};

const SignUp = (props: SignUpProps) => {
  const { onCancel, errors } = props;
  const usernameRef = useRef<HTMLInputElement>();
  const { register, handleSubmit, formState, setValue } = useForm<SignUpForm>({
    resolver: yupResolver(schema),
  });

  useEffect(() => {
    usernameRef?.current?.focus();
  }, [usernameRef]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const handler = handleSubmit((data) => {
      console.log("submitted login: " + JSON.stringify(data));
      props.onSubmit(data);
    });
    handler();
  }

  const getError = (path: "username" | "password" | "confirmPassword") => {
    const fieldError = formState.errors[path];
    const hasFieldError = fieldError !== undefined;
    if (hasFieldError) {
      const helperText = fieldError.message;
      return { error: true, helperText };
    }
    const error = errors[path] !== undefined;
    const helperText = errors[path];
    return { error, helperText };
  };

  function onAutoFill() {
    setValue("username", `testi ${new Date().toLocaleTimeString("fi-Fi")}`);
    setValue("password", "Salasana1");
    setValue("confirmPassword", "Salasana1");
  }

  return (
    <form onSubmit={(e) => onSubmit(e)}>
      <Box
        sx={{
          width: "350px",
          "& .MuiTextField-root": { mt: 1 },
          "& button": { width: "150px" },
          display: "flex",
          flexDirection: "column",
        }}
      >
        <TextField
          id="sign-up-username"
          label="Username"
          {...getError("username")}
          {...register("username")}
          inputRef={usernameRef}
        />
        <TextField
          id="sign-up-password"
          label="Password"
          type="password"
          error={formState.errors.password !== undefined}
          helperText={formState.errors.password?.message}
          {...register("password")}
        />
        <TextField
          id="sign-up-confirm-password"
          label="Confirm password"
          type="password"
          error={formState.errors.confirmPassword !== undefined}
          helperText={formState.errors.confirmPassword?.message}
          {...register("confirmPassword")}
        />
        <Box
          sx={{
            "& button": { ml: 1, mt: 1 },
            display: "flex",
            flexDirection: "row",
            alignItems: "flex-end",
            justifyContent: "flex-end",
          }}
        >
          <Button onClick={onCancel} variant="outlined">
            Cancel
          </Button>
          <Button type="submit" variant="contained">
            Submit
          </Button>
        </Box>
        {process.env.NODE_ENV === "development" && (
          <Button onClick={onAutoFill} variant="outlined" sx={{ mt: 1 }}>
            Auto-fill
          </Button>
        )}
      </Box>
    </form>
  );
};

export default SignUp;
