import { ShipDTO } from "../game/models/ship";

export type TransformShipPayload = {
  gameId: string;
  playerId: string;
  ship: ShipDTO;
};
