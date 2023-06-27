import axios from "axios";
import { config } from "../config/config";
import { Point } from "./point";

const _axios = axios.create({ baseURL: `${config.backendBaseUrl}/game` });

export type GuessCellPayload = {
  point: Point;
  guesserPlayerId: string;
  gameId: string;
};

export const guessCellRequest = (payload: GuessCellPayload) => {
  return _axios.post("/guess", payload);
};
