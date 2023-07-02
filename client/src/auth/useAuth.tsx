import { useEffect, useState } from "react";
import { handleError } from "../api/errorHandling";
import { getAccountInfo, getGuestAccountInfo } from "../auth/api";
import { login } from "../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectIsGuest,
  selectIsLoggedIn,
  selectUsername,
} from "../redux/selectors";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);

  const username = useAppSelector(selectUsername);
  const isGuest = useAppSelector(selectIsGuest);
  const isAuth = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();

  useEffect(() => {
    fetchAccountInfo();
  }, [username]);

  const fetchAccountInfo = async () => {
    if (isGuest) {
      setIsLoading(false);
      return;
    }

    try {
      // TODO Guest is not persisted, should be part of JWT to work
      const request = isGuest ? getGuestAccountInfo : getAccountInfo;
      const response = await request();
      const { userId, username } = response.data;
      dispatch(login({ userId, username, isGuest: false }));
    } catch (error) {
      handleError(error);
    } finally {
      setIsLoading(false);
    }
  };

  return { isLoading, isAuth };
};
