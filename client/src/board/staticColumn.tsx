import styles from "./styles.module.scss";

type StaticColumnProps = {
  items: number[] | string[];
  direction: "row" | "column";
};

const StaticColumn = ({ items, direction }: StaticColumnProps) => {
  return (
    <div className={styles.column} style={{ flexDirection: direction }}>
      {items.map((i) => (
        <div key={i} className={styles.square}>
          {i}
        </div>
      ))}
    </div>
  );
};

export default StaticColumn;
