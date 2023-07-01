import axios from "axios";
import { config } from "../config/config";
import { LoginForm } from "./loginForm";
import { SignUpForm } from "./singUpForm";

export const appAxios = axios.create({
  baseURL: config.backendBaseUrl,
  withCredentials: true,
});

export const signUpRequest = (payload: SignUpForm) => {
  return appAxios.post(`auth/sign-up`, payload);
};

export const signInRequest = (payload: LoginForm) => {
  return appAxios.post(`auth/sign-in`, payload);
};

export const signInAsGuestRequest = () => {
  return appAxios.get(`auth/guest/sign-in`);
};

export const signOutRequest = () => {
  return appAxios.post(`auth/sign-out`);
};

export const testJwt = (payload: { token: any }) => {
  // return appAxios.post(`auth/test-token`, payload);
  return appAxios.post(`auth/test-auth-middleware`, payload);
};
