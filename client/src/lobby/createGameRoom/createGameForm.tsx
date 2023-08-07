import { yupResolver } from "@hookform/resolvers/yup";
import {
  Button,
  FormControl,
  FormControlLabel,
  FormHelperText,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
  TextField,
} from "@mui/material";
import { FormEvent } from "react";
import { Controller, useForm } from "react-hook-form";
import { CreateGame, OpponentType } from "./createGame";
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
    control,
  } = useForm<CreateGame>({
    resolver: yupResolver(schema),
    defaultValues: { opponentType: OpponentType.HUMAN },
  });

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    const handler = handleSubmit((data) => {
      props.onSubmit(data);
    });
    handler();
  };

  return (
    <Stack
      component={"form"}
      onSubmit={onSubmit}
      direction={"column"}
      spacing={2}
      mt={1}
    >
      <TextField
        id="title"
        label="Title"
        error={errors.title ? true : false}
        helperText={errors.title?.message}
        {...register("title")}
      />
      <Controller
        name="opponentType"
        control={control}
        render={({ field, fieldState }) => {
          return (
            <FormControl>
              <FormLabel>Opponent</FormLabel>
              <RadioGroup value={field.value} onChange={field.onChange}>
                <FormControlLabel
                  label="Human"
                  value={OpponentType.HUMAN}
                  control={<Radio />}
                />
                <FormControlLabel
                  label="Computer"
                  value={OpponentType.COMPUTER}
                  control={<Radio />}
                />
              </RadioGroup>
              {fieldState.error && (
                <FormHelperText error>
                  {fieldState.error.message}
                </FormHelperText>
              )}
            </FormControl>
          );
        }}
      />
      <Stack direction="row" justifyContent="flex-end" spacing={2}>
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
