export type GameRoom = {
  id: string;
  title: string;
  players: GameRoomPlayer[];
  createdBy: string;
  createdAt: string;
};

export type GameRoomPlayer = {
  id: string;
  username: string;
};
