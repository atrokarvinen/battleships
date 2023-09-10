import { GameDTO, PlayerDTO } from "../models";
import { ShipDTO } from "../models/ship";
import { pointsEqual } from "./board-utils";
import { shipsToPoints } from "./shipToSquareMapper";

export const filterGameInfo = (ownId: string, gameDto: GameDTO) => {
  // Return only information that is visible to the player
  const requester = gameDto.players.find((p) => p.playerId === ownId);
  const opponent = gameDto.players.find((p) => p.playerId !== ownId);

  const selfInfo = filterPlayerInfo(requester?.playerId, gameDto);
  const opponentInfo = filterPlayerInfo(opponent?.playerId, gameDto);

  return { selfInfo, opponentInfo };
};

export const filterPlayerInfo = (
  ownId: string | undefined,
  gameDto: GameDTO
) => {
  const self = gameDto.players.find((p) => p.playerId === ownId);
  const opponent = gameDto.players.find((p) => p.playerId !== ownId);
  if (!self || !opponent) {
    return gameDto;
  }
  const attackedPoints = self.attacks;
  const opponentShipPoints = shipsToPoints(opponent.ownShips);
  const knownOpponentShipPoints = opponentShipPoints.filter((op) =>
    attackedPoints.some(pointsEqual(op))
  );
  const knownOpponentShips = knownOpponentShipPoints.map<ShipDTO>(
    (p, index) => ({
      id: index.toString(),
      start: p,
      length: 1,
      isVertical: false,
    })
  );
  const players: PlayerDTO[] = [
    { ...self },
    { ...opponent, ownShips: knownOpponentShips },
  ];
  const filteredGameDto = { ...gameDto, players };
  return filteredGameDto;
};
