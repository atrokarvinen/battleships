import { Types } from "mongoose";
import { GameModel } from "../database/dbSchema";
import { GameDTO, GameOptions, GameState, IGame, ShipPart } from "../models";
import {
  createEmptyBoardSquares,
  pointEqualsToSquare,
  pointsEqual,
} from "./board-utils";
import { createRandomFleetLocations } from "./shipGeneration";

export class GameCreationService {
  async createGame(game: IGame) {
    const created = await GameModel.create(game);
    const gameDTO: GameDTO = created.toObject();
    return gameDTO;
  }

  async createEmptyGame(options: GameOptions) {
    const emptyGame = this.generateEmptyGame(options);
    return await this.createGame(emptyGame);
  }

  generateEmptyGame({ gameRoomId, playerIds, firstPlayerId }: GameOptions) {
    const game: IGame = {
      gameRoom: new Types.ObjectId(gameRoomId),
      activePlayerId: firstPlayerId,
      players: playerIds.map((pId) => ({
        playerId: new Types.ObjectId(pId),
        attacks: createEmptyBoardSquares(10),
        ownShips: createEmptyBoardSquares(10),
      })),
      state: GameState.ENDED,
    };

    return game;
  }

  randomizePlacements(game: IGame) {
    game.players.forEach((player) => {
      const placements = createRandomFleetLocations();
      placements.forEach((placement) => {
        const { takenPoints, isVertical, start, end } = placement;
        takenPoints.forEach((shipPoint) => {
          const square = player.ownShips.find(pointEqualsToSquare(shipPoint));
          if (!square) {
            const { x, y } = shipPoint;
            throw new Error(`Square (${x}, ${y}) not found`);
          }
          const isStart = pointsEqual(start, shipPoint);
          const isEnd = pointsEqual(end, shipPoint);

          // Mutate square
          square.hasShip = true;
          square.ship = isStart
            ? ShipPart.START
            : isEnd
            ? ShipPart.END
            : ShipPart.MIDDLE;
          square.isVertical = isVertical;
        });
      });
    });
  }
}
