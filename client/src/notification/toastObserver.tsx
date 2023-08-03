import { Alert, Snackbar } from "@mui/material";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { closeErrorToast } from "./notificationSlice";

const ToastObserver = () => {
  const dispatch = useAppDispatch();
  const errorMessage = useAppSelector(
    (state) => state.notification.errorMessage
  );
  const open = !!errorMessage;

  const handleClose = () => {
    dispatch(closeErrorToast());
  };

  return (
    <Snackbar
      anchorOrigin={{ vertical: "top", horizontal: "center" }}
      open={open}
      autoHideDuration={5000}
      onClose={handleClose}
      ClickAwayListenerProps={{ onClickAway: () => {} }}
    >
      <Alert severity="error" variant="filled" onClose={handleClose}>
        {errorMessage}
      </Alert>
    </Snackbar>
  );
};

export default ToastObserver;
