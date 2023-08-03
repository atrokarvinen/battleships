import { Box } from "@mui/material";
import StaticSquareStack from "./staticSquareStack";
import styles from "./styles.module.scss";
import { useSquareStyle } from "./useSquareStyle";

const boardSize = 10;
const arr = Array.from(Array(boardSize)).map((_, index) => index);
const ranks = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

export const StaticSquares = () => {
  const { border } = useSquareStyle();
  return (
    <>
      <div className={styles.emptySquare}>
        <Box className={styles.square} sx={{ ...border }} />
      </div>
      <div className={styles.staticRow}>
        <StaticSquareStack items={arr} direction="row" />
      </div>
      <div className={styles.staticColumn}>
        <StaticSquareStack items={ranks} direction="column" />
      </div>
    </>
  );
};
