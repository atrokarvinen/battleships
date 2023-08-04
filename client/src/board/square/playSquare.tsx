import { Box, useTheme } from "@mui/material";
import cn from "classnames";
import { AttackResult, Point, Ship, ShipPart } from "../models";
import styles from "./styles.module.scss";
import { useSquareStyle } from "./useSquareStyle";

type PrimarySquareProps = {
  point: Point;
  shipPart?: Ship;
  lastAttacked: boolean;
  attackResult: AttackResult;

  squareClicked(p: Point): void;
};

const PlaySquare = ({
  point: { x, y },
  shipPart,
  squareClicked,
  lastAttacked,
  attackResult,
}: PrimarySquareProps) => {
  const theme = useTheme();
  const { border } = useSquareStyle();
  const hasShip = !!shipPart || attackResult === AttackResult.Hit;

  const getShipPartClassName = () => {
    if (!shipPart) {
      return styles.empty;
    }
    if (shipPart.isVertical) {
      if (shipPart.part === ShipPart.START) {
        return styles.shipStartVertical;
      }
      if (shipPart.part === ShipPart.MIDDLE) {
        return styles.shipMiddleVertical;
      }
      if (shipPart.part === ShipPart.END) {
        return styles.shipEndVertical;
      }
    } else {
      if (shipPart.part === ShipPart.START) {
        return styles.shipStartHorizontal;
      }
      if (shipPart.part === ShipPart.MIDDLE) {
        return styles.shipMiddleHorizontal;
      }
      if (shipPart.part === ShipPart.END) {
        return styles.shipEndHorizontal;
      }
    }
    return styles.empty;
  };

  const getBackgroundClass = () => {
    if (attackResult === AttackResult.Hit) {
      return styles.sunk;
    }
    if (attackResult === AttackResult.Miss) {
      return styles.missed;
    }
    if (hasShip) {
      return styles.shipColor;
    }
    return undefined;
  };

  return (
    <Box
      data-testid={`square-${x}-${y}`}
      className={styles.square}
      sx={{
        border: lastAttacked ? 3 : border.border,
        borderColor: lastAttacked
          ? theme.palette.warning.light
          : border.borderColor,
        ":hover": {
          borderColor: theme.palette.secondary.light,
          borderWidth: 3,
        },
      }}
      onClick={() => squareClicked({ x, y })}
    >
      <Box
        data-testid={hasShip ? "ship-square" : "water-square"}
        className={cn(getShipPartClassName(), getBackgroundClass(), {
          [styles.ship]: hasShip,
        })}
      />
    </Box>
  );
};

export { PlaySquare };
