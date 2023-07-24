import { Types } from "mongoose";
import { GameModel } from "../database/dbSchema";
import {
  AttackSquare,
  GameDTO,
  GameOptions,
  GameState,
  IGame,
  ShipPart,
} from "../models";
import {
  createEmptyBoardSquares,
  pointEqualsToSquare,
  pointsEqual,
} from "./board-utils";
import { createRandomFleetLocations } from "./shipGeneration";

export class GameService {
  async attackSquare({ point, gameId, attackerPlayerId }: AttackSquare) {
    const { x, y } = point;
    console.log(`Attacking point (${x}, ${y})...`);

    const game = await GameModel.findById(gameId);
    if (!game) {
      throw new Error(`Failed to find game '${gameId}'`);
    }

    const players = game.players;
    const own = players.find((p) => p.playerId.toString() === attackerPlayerId);
    const enemy = players.find(
      (p) => p.playerId.toString() !== attackerPlayerId
    );
    if (!own) {
      throw new Error(`Failed to find player '${attackerPlayerId}'`);
    }
    if (!enemy) {
      throw new Error(`Failed to find enemy of player '${attackerPlayerId}'`);
    }
    const attackedSquareOwnSide = own.attacks.find(pointEqualsToSquare(point));
    const attackedSquareEnemySide = enemy.ownShips.find(
      pointEqualsToSquare(point)
    );
    if (!attackedSquareOwnSide || !attackedSquareEnemySide) {
      throw new Error(`Failed to find square at point '${point}'`);
    }
    attackedSquareOwnSide.ship = attackedSquareEnemySide.ship;
    attackedSquareOwnSide.isVertical = attackedSquareEnemySide.isVertical;
    attackedSquareOwnSide.hasShip = attackedSquareEnemySide.hasShip;
    attackedSquareOwnSide.hasBeenAttacked = true;
    attackedSquareEnemySide.hasBeenAttacked = true;

    const shipHit = attackedSquareEnemySide.hasShip;
    const nextPlayerId = shipHit ? attackerPlayerId : enemy.playerId.toString();

    game.activePlayerId = nextPlayerId;

    const isGameOver = enemy.ownShips
      .filter((x) => x.hasShip)
      .every((x) => x.hasBeenAttacked);

    if (isGameOver) {
      game.winnerId = attackerPlayerId;
    }

    console.log("Point attacked. hasShip:", attackedSquareEnemySide.hasShip);
    console.log("Is game over:", isGameOver);

    const updatedGame = await game.save();

    return { shipHit, nextPlayerId, isGameOver };
  }

  async createGame(game: IGame) {
    const created = await GameModel.create(game);
    const gameDTO: GameDTO = created.toObject();
    return gameDTO;
  }

  async createEmptyGame(options: GameOptions) {
    const emptyGame = this.generateEmptyGame(options);
    return await this.createGame(emptyGame);
  }

  async resetGame(options: GameOptions) {
    const gameRoomId = new Types.ObjectId(options.gameRoomId);
    const game = await GameModel.findOne({ gameRoom: gameRoomId });

    if (!game) {
      throw new Error(`Game with game room id '${gameRoomId}' was not found`);
    }
    const emptyGame = this.generateEmptyGame(options);
    const updatedGame = await game.updateOne(emptyGame);
    const gameDto: GameDTO = updatedGame.toObject();
    return gameDto;
  }

  async deleteGamesFromRoom(gameRoomId: string) {
    const gameRoom = new Types.ObjectId(gameRoomId);
    const result = await GameModel.deleteMany({ gameRoom });
    console.log(`Deleted (${result.deletedCount}) games from game room`);
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
      state: GameState.STARTED,
    };

    return game;
  }

  async randomizePlacements(gameId: string) {
    const game = await GameModel.findById(gameId);

    if (!game) {
      throw new Error(`Game '${gameId}' was not found`);
    }

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

    const updated = await game.save();
    const gameDTO: GameDTO = updated.toObject();
    return gameDTO;
  }
}
