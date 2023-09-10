import { axios } from "../api/axios";
import { LoginForm } from "./loginForm";
import { SignUpForm } from "./singUpForm";

export const signUpRequest = (payload: SignUpForm) => {
  return axios.post("auth/sign-up", payload);
};

export const signInRequest = (payload: LoginForm) => {
  return axios.post("auth/sign-in", payload);
};

export const signInAsGuestRequest = () => {
  return axios.get("auth/guest/sign-in");
};

export const signOutRequest = () => {
  return axios.post("auth/sign-out");
};

export const getAccountInfo = () => {
  return axios.get("/account");
};

