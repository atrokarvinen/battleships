import { IconButton, IconButtonProps } from "@mui/material";
import { ReactElement } from "react";
import "./styles.scss";

type CustomIconButtonProps = IconButtonProps & { icon: ReactElement };

const CustomIconButton = ({
  icon,
  disabled,
  ...rest
}: CustomIconButtonProps) => {
  return (
    <IconButton
      id="icon-button"
      sx={{
        width: "50px",
        borderRadius: "4px",
        color: "var(--mui-palette-common-white)",
        backgroundColor: "var(--mui-palette-primary-main)",
        ":hover": { backgroundColor: "var(--mui-palette-primary-dark)" },
      }}
      className={disabled ? "disabled" : undefined}
      disabled={disabled}
      {...rest}
    >
      {icon}
    </IconButton>
  );
};

export default CustomIconButton;
