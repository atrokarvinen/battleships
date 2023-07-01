import StaticColumn from "./staticColumn";
import styles from "./styles.module.scss";

const boardSize = 10;
const arr = Array.from(Array(boardSize)).map((_, index) => index);
const ranks = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

export const StaticSquares = () => {
  return (
    <>
      <div className={styles.emptySquare}>
        <div className={styles.square} />
      </div>
      <div className={styles.staticRow}>
        <StaticColumn items={arr} direction="row" />
      </div>
      <div className={styles.staticColumn}>
        <StaticColumn items={ranks} direction="column" />
      </div>
    </>
  );
};
