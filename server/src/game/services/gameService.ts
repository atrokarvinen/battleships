import { Types } from "mongoose";
import { GameModel } from "../database/dbSchema";
import {
  AttackSquare,
  GameDTO,
  GameOptions,
  GameState,
  IGame,
} from "../models";
import { pointEqualsToSquare } from "./board-utils";
import { GameCreationService } from "./gameCreationService";

export class GameService {
  private gameCreationService: GameCreationService = new GameCreationService();

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

  createGame(game: IGame) {
    return this.gameCreationService.createGame(game);
  }

  createEmptyGame(options: GameOptions) {
    return this.gameCreationService.createEmptyGame(options);
  }

  async resetGame(options: GameOptions) {
    const gameRoomId = new Types.ObjectId(options.gameRoomId);
    const game = await GameModel.findOne({ gameRoom: gameRoomId });

    if (!game) {
      throw new Error(`Game with game room id '${gameRoomId}' was not found`);
    }
    const emptyGame = this.gameCreationService.generateEmptyGame(options);
    await game.updateOne(emptyGame);

    game.activePlayerId = undefined;
    await game.save();

    const gameDto = await this.getGame(game.id);
    return gameDto!;
  }

  async getGame(gameId: string) {
    const game = await GameModel.findById(gameId);
    const gameDto: GameDTO | undefined = game?.toObject();
    return gameDto;
  }

  async deleteGamesFromRoom(gameRoomId: string) {
    const gameRoom = new Types.ObjectId(gameRoomId);
    const result = await GameModel.deleteMany({ gameRoom });
    console.log(`Deleted (${result.deletedCount}) games from game room`);
  }

  async startWithRandomPlacements(gameId: string) {
    const game = await GameModel.findById(gameId);

    if (!game) {
      throw new Error(`Game '${gameId}' was not found`);
    }

    this.gameCreationService.randomizePlacements(game);
    game.state = GameState.STARTED;

    game.activePlayerId = game.players[0].playerId.toString();

    const updated = await game.save();
    const gameDTO: GameDTO = updated.toObject();
    return gameDTO;
  }
}
