import { Types } from "mongoose";
import { Game, GameState, Point, ShipPart } from "../models";
import { GameDTO, IGame } from "../models/game";
import { GameOptions } from "../models/gameOptions";
import {
  createEmptyBoardSquares,
  pointEqualsToSquare,
  pointsEqual,
} from "../services/board-utils";
import { createRandomFleetLocations } from "../services/shipGeneration";
import { GameModel } from "./dbSchema";

type AttackSquare = {
  point: Point;
  attackerPlayerId: string;
  gameId: string;
};

export class DbService {
  async attackSquare({ point, gameId, attackerPlayerId }: AttackSquare) {
    const { x, y } = point;
    console.log(`Attacking point (${x}, ${y})`);

    const game = await GameModel.findById(gameId);
    if (!game) {
      throw new Error(`Failed to find game '${gameId}'`);
    }
    // TODO refactor wording
    const infos = game.playerInfos;
    const own = infos.find((b) => b.playerId === attackerPlayerId);
    const enemy = infos.find((b) => b.playerId !== attackerPlayerId);
    if (!own) {
      throw new Error(`Failed to find primary board of '${attackerPlayerId}'`);
    }
    if (!enemy) {
      throw new Error(`Failed to find tracking board`);
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
    const otherPlayer = game.playerIds.find((pId) => pId !== attackerPlayerId);
    const nextPlayerId = shipHit ? attackerPlayerId : otherPlayer!;

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

  async createGame(game: Game) {
    const created = await GameModel.create(game);
    const gameDTO: GameDTO = created.toObject();
    return gameDTO;
  }

  async createEmptyGame(options: GameOptions) {
    const emptyGame = this.generateEmptyGame(options);
    const created = await GameModel.create(emptyGame);
    const gameDTO: GameDTO = created.toObject();
    return gameDTO;
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
      playerInfos: playerIds.map((pId) => ({
        playerId: pId,
        attacks: createEmptyBoardSquares(10),
        ownShips: createEmptyBoardSquares(10),
      })),
      playerIds,
      state: GameState.STARTED,
    };

    return game;
  }

  async randomizePlacements(gameId: string) {
    const game = await GameModel.findById(gameId);

    if (!game) {
      throw new Error(`Game '${gameId}' was not found`);
    }

    const players = game.playerIds;
    players.forEach((playerId) => {
      const board = game.playerInfos.find((b) => b.playerId === playerId);
      if (!board) {
        throw new Error(`Board of player '${playerId}' was not found`);
      }

      const placements = createRandomFleetLocations();
      placements.forEach((placement) => {
        const { takenPoints, isVertical, start, end } = placement;
        takenPoints.forEach((shipPoint) => {
          const square = board.ownShips.find(pointEqualsToSquare(shipPoint));
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
