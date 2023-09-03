import { axios } from "../../api/axios";
import { ShipDTO } from "../../game/apiModel";

export type TransformShipPayload = {
  gameId: string;
  playerId: string;
  ship: ShipDTO;
};

export type ConfirmPlacementsPayload = { gameId: string };

export const transformShipRequest = (payload: TransformShipPayload) => {
  return axios.put(`ship-builder/ship/${payload.ship.id}`, payload);
};

export const confirmPlacementsRequest = (payload: ConfirmPlacementsPayload) => {
  return axios.post(`ship-builder/confirm`, payload);
};
