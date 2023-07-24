import _ from "lodash";
import { BoardPoint } from "../board/point";
import { RootState } from "./store";

// Players
export const selectPlayers = (state: RootState) =>
  Object.values(state.players.byId);
export const selectPlayersInGame = (state: RootState, gameId: string) => {
  console.log("Selecting players in game...");
  const players = Object.values(state.players.byId);
  return players.filter((p) => p.gamesJoined.some((id) => id === gameId));
};
export const selectPlayerIds = (state: RootState) => state.players.allIds;

// Chat
export const selectChatMessages = (state: RootState) => state.chat.messages;

// Auth
export const selectIsLoggedIn = (state: RootState) => state.auth.isLoggedIn;
export const selectIsGuest = (state: RootState) => state.auth.isGuest;
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
export const selectActiveGameId = (state: RootState) => state.activeGame.id;
export const selectActivePlayerId = (state: RootState) =>
  state.activeGame.activePlayerId;
export const selectIsGameStarted = (state: RootState) =>
  state.activeGame.isGameStarted;
export const selectIsGameOver = (state: RootState) =>
  state.activeGame.isGameOver;
export const selectShowGameOverDialog = (state: RootState) =>
  state.activeGame.showGameOverDialog;
export const selectShowOpponentShips = (state: RootState) =>
  state.activeGame.showOpponentBoard;

// Players
export const selectPlayerById = (state: RootState, id: string) => {
  return state.players.byId[id];
};
export const selectWinnerPlayer = (state: RootState) => {
  const winnerId = state.activeGame.winnerPlayerId;
  if (!winnerId) return undefined;
  const winner = state.players.byId[winnerId];
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
  const board = state.activeGame.attacks.find(
    (board) => board.playerId === playerId
  );
  if (!board) return [];
  return board.points;
};
export const selectBoardState = (state: RootState) => state.board.boards;

export const boardPointsMatch = (pointA: BoardPoint, pointB: BoardPoint) => {
  return pointA.point.x === pointB.point.x && pointA.point.y === pointB.point.y;
};
