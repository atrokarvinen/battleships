import { Types } from "mongoose";
import { ApiError } from "../../middleware/errorHandleMiddleware";
import { GameModel } from "../database/dbSchema";
import {
  AttackSquare,
  GameDTO,
  GameOptions,
  GameState,
  IGame,
  IPlayer,
} from "../models";
import { pointEqualsToSquare, pointsEqual } from "./board-utils";
import { GameCreationService } from "./gameCreationService";

export class GameService {
  private gameCreationService: GameCreationService = new GameCreationService();

  async attackSquare(params: AttackSquare) {
    const { point, gameId, attackerPlayerId } = params;
    const { x, y } = point;
    console.log(`Attacking point (${x}, ${y})...`);

    const game = await GameModel.findById(gameId);
    if (!game) {
      throw new Error(`Failed to find game '${gameId}'`);
    }

    const players = game.players;
    const attacker = players.find(
      (p) => p.playerId.toString() === attackerPlayerId
    );
    const defender = players.find(
      (p) => p.playerId.toString() !== attackerPlayerId
    );
    if (!attacker) {
      throw new Error(`Failed to find attacker '${attackerPlayerId}'`);
    }
    if (!defender) {
      throw new Error(`Failed to find defender '${attackerPlayerId}'`);
    }
    const attackerSquare = attacker.attacks.find(pointEqualsToSquare(point));
    const defenderSquare = defender.ownShips.find(pointEqualsToSquare(point));
    if (!attackerSquare || !defenderSquare) {
      throw new Error(`Failed to find square at point '${point}'`);
    }

    this.validateAttack(params, game, attacker);

    attackerSquare.hasShip = defenderSquare.hasShip;
    attackerSquare.hasBeenAttacked = true;
    defenderSquare.hasBeenAttacked = true;

    const shipHit = defenderSquare.hasShip;
    const nextPlayerId = shipHit
      ? attackerPlayerId
      : defender.playerId.toString();

    game.activePlayerId = nextPlayerId;

    const isGameOver = defender.ownShips
      .filter((x) => x.hasShip)
      .every((x) => x.hasBeenAttacked);

    if (isGameOver) {
      game.winnerPlayerId = attackerPlayerId;
      game.state = GameState.ENDED;
    }

    const updatedGame = await game.save();

    return { shipHit, nextPlayerId, isGameOver };
  }

  private validateAttack(params: AttackSquare, game: IGame, attacker: IPlayer) {
    const { attackerPlayerId, point } = params;
    const isPlayerTurn = game.activePlayerId === attackerPlayerId;
    const squareAlreadyAttacked = attacker.attacks
      .filter((a) => a.hasBeenAttacked)
      .some((a) => pointsEqual(a.point, point));
    const isGameStateCorrect = game.state === GameState.STARTED;

    if (!isPlayerTurn) {
      throw new ApiError("Can only attack on own turn", 400);
    }
    if (squareAlreadyAttacked) {
      throw new ApiError("Square has been attacked already", 400);
    }
    if (!isGameStateCorrect) {
      const stateStr = GameState[game.state];
      throw new ApiError(`Cannot attack in game state '${stateStr}'`, 400);
    }
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

    const gameDto = await this.findGame(game.id);
    return gameDto!;
  }

  async findGame(gameId: string) {
    const game = await GameModel.findById(gameId);
    const gameDto: GameDTO | undefined = game?.toObject();
    return gameDto;
  }

  async getGame(gameId: string) {
    const game = await GameModel.findById(gameId).populate("gameRoom");
    if (!game) {
      throw new ApiError(`Game '${gameId}' was not found`, 404);
    }
    const gameDto: GameDTO = game.toObject();
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
