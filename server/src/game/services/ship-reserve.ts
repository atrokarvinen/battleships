import { FleetReserve, FleetShip } from "../models";

export const carrier: FleetShip = { name: "carrier", size: 6 };
export const battleship: FleetShip = { name: "battleship", size: 4 };
export const cruiser: FleetShip = { name: "cruiser", size: 3 };
export const submarine: FleetShip = { name: "submarine", size: 2 };

export const standardCarrierQuantity = 1;
export const standardBattleshipQuantity = 2;
export const standardCruiserQuantity = 2;
// export const standardSubmarineQuantity = 3;
export const standardSubmarineQuantity = 1;

export const standardReserve: FleetReserve = {
  fleets: [
    // { quantity: standardCarrierQuantity, class: carrier },
    // { quantity: standardBattleshipQuantity, class: battleship },
    // { quantity: standardCruiserQuantity, class: cruiser },
    { quantity: standardSubmarineQuantity, class: submarine },
  ],
  totalQuantity:
    standardCarrierQuantity +
    standardBattleshipQuantity +
    standardCruiserQuantity +
    standardSubmarineQuantity,
};

export const standardTotalShipSquares = standardReserve.fleets
  .map((f) => f.quantity * f.class.size)
  .reduce((size, totalSize) => size + totalSize, 0);
