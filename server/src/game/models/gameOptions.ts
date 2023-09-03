export type GameOptions = {
  gameRoomId: string;
  players: PlayerOption[];
  firstPlayerId?: string;
};

export type PlayerOption = {
  id: string;
  isAi: boolean;
};
