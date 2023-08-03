import { Box, Stack } from "@mui/material";
import styles from "./styles.module.scss";
import { useSquareStyle } from "./useSquareStyle";

type StaticColumnProps = {
  items: number[] | string[];
  direction: "row" | "column";
};

const StaticSquareStack = ({ items, direction }: StaticColumnProps) => {
  const { border } = useSquareStyle();
  return (
    <Stack direction={direction}>
      {items.map((item) => (
        <Box key={item} className={styles.square} sx={{ ...border }}>
          {item}
        </Box>
      ))}
    </Stack>
  );
};

export default StaticSquareStack;
