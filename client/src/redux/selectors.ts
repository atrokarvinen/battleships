import _ from "lodash";
import { BoardPoint } from "../board/point";
import { RootState } from "./store";

// Players
export const selectPlayers = (state: RootState) => state.players.players;
export const selectPlayersInGame = (state: RootState, gameId: string) => {
  console.log("Selecting players in game...");
  return state.players.players.filter((p) =>
    p.gamesJoined.some((id) => id === gameId)
  );
};
export const selectPlayerIds = (state: RootState) => state.players.playerIds;

// Chat
export const selectChatMessages = (state: RootState) => state.chat.messages;

// Auth
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectUsername = (state: RootState) => state.auth.username;
export const selectUserId = (state: RootState) => state.auth.userId;

// Game
export const selectGamesById = (state: RootState) => state.gameRoom.byId;
export const selectGames = (state: RootState) =>
  Object.values(state.gameRoom.byId);
export const selectGame = (state: RootState, id: string | undefined) =>
  _.find(state.gameRoom.byId, (x) => x.id === id);

// Active Game
export const selectActiveGame = (state: RootState) => state.activeGame;
export const selectActivePlayers = (state: RootState) =>
  state.activeGame.players;
export const selectActivePlayerId = (state: RootState) =>
  state.activeGame.activePlayerId;
export const selectIsGameOver = (state: RootState) =>
  state.activeGame.isGameOver;
export const selectShowGameOverDialog = (state: RootState) =>
  state.activeGame.showGameOverDialog;

// Players
export const selectPlayerById = (state: RootState, id: string) => {
  const player = state.players.players.find((p) => p.id === id);
  return player;
};
export const selectWinnerPlayer = (state: RootState) => {
  const winnerId = state.activeGame.winnerPlayerId;
  const winner = state.players.players.find((p) => p.id === winnerId);
  return winner;
};

// Board
export const selectPoints = (state: RootState, playerId: string) => {
  const board = state.activeGame.boards.find(
    (board) => board.playerId === playerId
  );
  if (!board) return [];
  return board.points;
};
export const selectEnemyPoints = (state: RootState, playerId: string) => {
  const board = state.activeGame.guesses.find(
    (board) => board.playerId === playerId
  );
  if (!board) return [];
  return board.points;
};
export const selectBoardState = (state: RootState) => state.board.boards;

export const boardPointsMatch = (pointA: BoardPoint, pointB: BoardPoint) => {
  return pointA.point.x === pointB.point.x && pointA.point.y === pointB.point.y;
};
