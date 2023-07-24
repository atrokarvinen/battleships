
export type GameRoom = {
  id: string;
  title: string;
  players: GameRoomPlayer[];
};

export type GameRoomPlayer = {
  id: string;
  username: string;
};
