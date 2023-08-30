import { GameDTO, Player, Ship } from "../models";
import { pointEquals } from "./board-utils";
import { shipsToPoints } from "./shipToSquareMapper";

export const filterGameInfo = (ownId: string, gameDto: GameDTO) => {
  const self = gameDto.players.find((p) => p.playerId === ownId);
  const opponent = gameDto.players.find((p) => p.playerId !== ownId);
  if (!self || !opponent) {
    return gameDto;
  }
  const attackedPoints = self.attacks;
  const opponentShipPoints = shipsToPoints(opponent.ownShips);
  const knownOpponentShipPoints = opponentShipPoints.filter((op) =>
    attackedPoints.some(pointEquals(op))
  );
  const knownOpponentShips = knownOpponentShipPoints.map<Ship>((p) => ({
    start: p,
    length: 1,
    isVertical: false,
  }));
  const players: Player[] = [
    { ...self },
    { ...opponent, ownShips: knownOpponentShips },
  ];
  const filteredGameDto = { ...gameDto, players };
  return filteredGameDto;
};
