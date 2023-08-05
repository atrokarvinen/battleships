import { GameRoom } from "./gameRoom";

export const getPlayerNames = (game: GameRoom) => {
  const playerNames = game.players.map((p) => p.username);
  const player1 = playerNames.length > 0 ? playerNames[0] : "N/A";
  const player2 = playerNames.length > 1 ? playerNames[1] : "N/A";
  return { player1, player2 };
};
