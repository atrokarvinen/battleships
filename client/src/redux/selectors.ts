import { RootState } from "./store";

// Players
export const selectPlayers = (state: RootState) =>
  Object.values(state.players.byId);
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
  id ? state.gameRoom.byId[id] : undefined;
export const selectGameRoom = (state: RootState, id: string) =>
  state.gameRoom.byId[id];

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
export const selectPlayersInGameRoom = (state: RootState, id: string) => {
  const gameRoom = state.gameRoom.byId[id];
  if (!gameRoom) return [];
  return gameRoom.players;
};
export const selectGamePlayerById = (state: RootState, playerId: string) =>
  state.activeGame.players.find((p) => p.playerId === playerId);
export const selectPlayerShips = (playerId: string) => (state: RootState) => {
  const player = selectGamePlayerById(state, playerId);
  return player ? player.ownShips : [];
};
export const selectPlayerAttacks = (playerId: string) => (state: RootState) => {
  const player = selectGamePlayerById(state, playerId);
  return player ? player.attacks : [];
};

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
export const selectOwnPoints = (state: RootState, playerId: string) => {
  const player = state.activeGame.players.find((p) => p.playerId === playerId);
  if (!player) return [];
  return player.ownShips;
};
export const selectEnemyPoints = (state: RootState, playerId: string) => {
  const player = state.activeGame.players.find((p) => p.playerId !== playerId);
  if (!player) return [];
  return player.ownShips;
};
