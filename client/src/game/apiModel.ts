export type Ship = {
  length: number;
  start: Point;
  isVertical: boolean;
};

export type Point = {
  x: number;
  y: number;
};

export enum SquareDisplay {
  UNKNOWN,
  EMPTY,
  MISS,
  DESTROYED,
}

export enum ShipPart {
  UNKNOWN,
  START,
  MIDDLE,
  END,
}

export type Square = {
  point: Point;

  hasBeenAttacked: boolean;
  hasShip: boolean;
  ship: ShipPart;

  isVertical: boolean;
};

export type PlayerDTO = {
  playerId: string;
  ownShips: ShipDTO[];
  attacks: Point[];
};

export type Board = {
  playerId: string;

  shipPoints?: Point[];
  attackedPoints?: Point[];
  missedPoints?: Point[];
  destroyedPoints?: Point[];

  ships: Ship[];
  squares: Square[];
};

export enum GameState {
  UNKNOWN,
  STARTED,
  ENDED,
}

export type ShipDTO = {
  length: number;
  start: Point;
  isVertical: boolean;
};

export type GameDTO = {
  id: string;
  gameRoom: string;

  activePlayerId: string;
  winnerPlayerId: string;

  state: GameState;

  players: PlayerDTO[];
  primaryBoard: any;
  trackingBoard: any;
};
