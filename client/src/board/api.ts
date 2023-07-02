import { axios } from "../api/axios";
import { Point } from "./point";

export type AttackSquarePayload = {
  point: Point;
  attackerPlayerId: string;
  gameId: string;
};

export const attackSquareRequest = (payload: AttackSquarePayload) => {
  return axios.post("/game/attack", payload);
};
