import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Alert, Grid } from "@mui/material";
import { FormEvent, useEffect } from "react";
import { useForm } from "react-hook-form";
import { LoginForm } from "./loginForm";
import { schema } from "./loginValidation";
import styles from "./styles.module.scss";

type SignInProps = {
  defaultValues?: LoginForm;
  onSubmit(data: LoginForm): void;
  error?: string;
};

const SignIn = (props: SignInProps) => {
  const { defaultValues, error } = props;
  const { register, handleSubmit, formState, setValue } = useForm<LoginForm>({
    resolver: yupResolver(schema),
    defaultValues,
  });
  useEffect(() => {
    if (defaultValues) {
      setValue("username", defaultValues.username);
      setValue("password", defaultValues.password);
    }
  }, [defaultValues]);

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const handler = handleSubmit(async (data) => {
      props.onSubmit(data);
    });
    handler();
  }

  return (
    <form
      className={styles.loginForm}
      onSubmit={(e) => onSubmit(e)}
      autoComplete="on"
    >
      {error && <Alert severity="error">{error}</Alert>}
      <TextField
        id="username"
        label="Username"
        margin="dense"
        error={formState.errors.username !== undefined}
        helperText={formState.errors.username?.message}
        InputLabelProps={{
          shrink: defaultValues ? true : undefined,
        }}
        {...register("username")}
      />
      <TextField
        id="password"
        label="Password"
        type="password"
        margin="dense"
        error={formState.errors.password !== undefined}
        helperText={formState.errors.password?.message}
        InputLabelProps={{
          shrink: defaultValues ? true : undefined,
        }}
        {...register("password")}
      />
      <Button type="submit" variant="contained" sx={{ width: "150px", mt: 1 }}>
        Login
      </Button>
    </form>
  );
};

export default SignIn;
