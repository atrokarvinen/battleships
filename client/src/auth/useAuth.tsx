import { useEffect, useState } from "react";
import { getAccountInfo } from "../lobby/api";
import { handleError } from "./errorHandling";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { login, logout as logoutUser } from "../redux/authSlice";
import {
  selectIsLoggedIn,
  selectUsername,
  selectUserId,
} from "../redux/selectors";
import { signInRequest, signOutRequest } from "./api";
import { useNavigate } from "react-router-dom";

export const useAuth = () => {
  const [isLoading, setIsLoading] = useState(true);

  const username = useAppSelector(selectUsername);
  const userId = useAppSelector(selectUserId);
  const isAuth = useAppSelector(selectIsLoggedIn);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // console.log("is auth:", isAuth);

  useEffect(() => {
    fetchAccountInfo();
  }, [username]);

  const fetchAccountInfo = async () => {
    try {
      const response = await getAccountInfo();
      const { userId, username } = response.data;
      dispatch(login({ userId, username }));
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
