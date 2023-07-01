import axios from "axios";
import { config } from "../config/config";
import { Point } from "./point";

const _axios = axios.create({ baseURL: `${config.backendBaseUrl}/game` });

export type AttackSquarePayload = {
  point: Point;
  attackerPlayerId: string;
  gameId: string;
};

export const attackSquareRequest = (payload: AttackSquarePayload) => {
  return _axios.post("/attack", payload);
};
