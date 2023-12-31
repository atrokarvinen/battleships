import { Box, useTheme } from "@mui/material";
import cn from "classnames";
import { AttackResult, Point, Ship, ShipPart } from "../models";
import styles from "./styles.module.scss";
import { useSquareStyle } from "./useSquareStyle";

type PrimarySquareProps = {
  attackResult: AttackResult;
  isSelectedForBuilder: boolean;
  lastAttacked: boolean;
  point: Point;
  shipPart?: Ship;
  squareClicked(p: Point): void;
};

const PlaySquare = ({
  attackResult,
  isSelectedForBuilder,
  lastAttacked,
  point: { x, y },
  shipPart,
  squareClicked,
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
      return isSelectedForBuilder ? styles.sunk : styles.shipColor;
    }
    return undefined;
  };

  return (
    <Box
      data-testid={`square-${x}-${y}`}
      className={styles.square}
      onClick={() => squareClicked({ x, y })}
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
