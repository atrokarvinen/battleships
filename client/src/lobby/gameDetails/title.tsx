import CloseIcon from "@mui/icons-material/Close";
import { DialogTitle, IconButton, Stack } from "@mui/material";

type TitleProps = { title: string; onClose(): void };

const Title = ({ title, onClose }: TitleProps) => {
  return (
    <DialogTitle>
      <Stack direction="row" justifyContent="space-between">
        <span>
          <span>Game</span>
          &nbsp;
          <span>{`'${title}'`}</span>
        </span>
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </Stack>
    </DialogTitle>
  );
};

export { Title };
