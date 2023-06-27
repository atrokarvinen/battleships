export type FleetReserve = {
  fleets: Fleet[];
  totalQuantity: number;
};

export type Fleet = {
  quantity: number;
  class: Boat;
};

export type Boat = {
  name: string;
  size: number;
};

export const carrier: Boat = { name: "carrier", size: 6 };
export const battleship: Boat = { name: "battleship", size: 4 };
export const cruiser: Boat = { name: "cruiser", size: 3 };
export const submarine: Boat = { name: "submarine", size: 2 };

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

export const standardTotalBoatSquares = standardReserve.fleets
  .map((f) => f.quantity * f.class.size)
  .reduce((size, totalSize) => size + totalSize, 0);
