import { yupResolver } from "@hookform/resolvers/yup";
import { Button, Stack, TextField } from "@mui/material";
import { FormEvent } from "react";
import { useForm } from "react-hook-form";
import { CreateGame } from "./createGame";
import { schema } from "./createGameValidation";

type CreateGameFormProps = {
  onCancel(): void;
  onSubmit(data: CreateGame): void;
};

const CreateGameForm = (props: CreateGameFormProps) => {
  const { onCancel } = props;
  const {
    formState: { errors },
    register,
    handleSubmit,
  } = useForm<CreateGame>({
    resolver: yupResolver(schema),
  });

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const handler = handleSubmit((data) => {
      props.onSubmit(data);
    });
    handler();
  }

  return (
    <Stack
      component={"form"}
      onSubmit={onSubmit}
      direction={"column"}
      spacing={2}
    >
      <TextField
        id="title"
        label="Title"
        error={errors.title ? true : false}
        helperText={errors.title?.message}
        margin="normal"
        {...register("title")}
      />
      <Stack direction="row" justifyContent={"flex-end"} spacing={2}>
        <Button onClick={onCancel} variant="outlined">
          Cancel
        </Button>
        <Button type="submit" variant="contained">
          Submit
        </Button>
      </Stack>
    </Stack>
  );
};

export default CreateGameForm;
