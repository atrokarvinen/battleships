export type Boat = {
  length: number;
  start: Point;
  isVertical: boolean;
};

export type Point = {
  x: number;
  y: number;
};

export enum CellDisplay {
  UNKNOWN,
  EMPTY,
  MISS,
  DESTROYED,
}

export enum BoatPart {
  UNKNOWN,
  START,
  MIDDLE,
  END,
}

export type Cell = {
  point: Point;

  hasBeenGuessed: boolean;
  hasBoat: boolean;
  boat: BoatPart;

  isVertical: boolean;
};

export type PlayerInformation = {
  playerId: string;
  ownShips: Cell[];
  guesses: Cell[];
};

export type Board = {
  playerId: string;

  boatPoints?: Point[];
  guessedPoints?: Point[];
  missedPoints?: Point[];
  destroyedPoints?: Point[];

  boats: Boat[];
  cells: Cell[];
};

export enum GameState {
  UNKNOWN,
  STARTED,
  ENDED,
}

export type Game = {
  gameRoomId: string;

  activePlayerId: string;
  playerIds: string[];
  playerInfos: PlayerInformation[];
  winnerId: string;

  state: GameState;

  // boards: Board[];
};
