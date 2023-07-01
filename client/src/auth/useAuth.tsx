import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAccountInfo, getGuestAccountInfo } from "../lobby/api";
import { login, logout as logoutUser } from "../redux/authSlice";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import {
  selectIsGuest,
  selectIsLoggedIn,
  selectUserId,
  selectUsername,
} from "../redux/selectors";
import { signOutRequest } from "./api";
import { handleError } from "./errorHandling";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);

  const username = useAppSelector(selectUsername);
  const isGuest = useAppSelector(selectIsGuest);
  const userId = useAppSelector(selectUserId);
  const isAuth = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // console.log("is auth:", isAuth);
  // console.log("loading:", isLoading);

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

  const logout = async () => {
    try {
      await signOutRequest();
      navigate("/");
      dispatch(logoutUser());
    } catch (error) {
      handleError(error);
    }
  };

  return { userId, username, isLoading, isAuth, logout };
};
