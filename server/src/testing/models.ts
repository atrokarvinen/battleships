export type GameSeed = {
  gameRoomId: string;
  shipPositions: ShipPlacement[];
};

export type ShipPlacement = {
  playerId: string;
  shipPoints: Point[];
};

export type Point = {
  x: number;
  y: number;
};
