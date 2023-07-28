import { GameDTO } from "../models";

export const filterGameInfo = (requesterId: string, gameDto: GameDTO) => {
  const requester = gameDto.players.find((p) => p.playerId === requesterId);
  const notPlayingInGame = !requester;
  if (notPlayingInGame) {
    return gameDto;
  }
  const filteredGameDto = {
    ...gameDto,
    players: [],
    primaryBoard: requester.ownShips,
    trackingBoard: requester.attacks,
  };
  return filteredGameDto;
};
