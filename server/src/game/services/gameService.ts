import { Types } from "mongoose";
import { ApiError } from "../../middleware/errorHandleMiddleware";
import { GameModel } from "../database/gameSchema";
import {
  AttackSquare,
  GameDTO,
  GameOptions,
  GameState,
  IGame,
  IPlayer,
  Point,
} from "../models";
import { pointEquals } from "./board-utils";
import { GameCreationService } from "./gameCreationService";
import { shipsToPoints } from "./shipToSquareMapper";

export class GameService {
  private gameCreationService: GameCreationService = new GameCreationService();

  async attackSquare(params: AttackSquare) {
    const { point: attackedPoint, gameId, attackerPlayerId } = params;
    const { x, y } = attackedPoint;
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
    this.validateAttack(params, game, attacker);

    const { attacks } = attacker;
    attacks.push(attackedPoint);

    const defenderShipPoints = shipsToPoints(defender.ownShips);
    const shipHit = defenderShipPoints.some(pointEquals(attackedPoint));
    const nextPlayerId = shipHit
      ? attackerPlayerId
      : defender.playerId.toString();

    game.activePlayerId = nextPlayerId;

    const isGameOver = this.checkContainsAllPoints(attacks, defenderShipPoints);

    if (isGameOver) {
      game.winnerPlayerId = attackerPlayerId;
      game.state = GameState.ENDED;
    }

    const updatedGame = await game.save();

    return { shipHit, nextPlayerId, isGameOver };
  }

  private checkContainsAllPoints(superset: Point[], subset: Point[]) {
    return subset.every((dp) => superset.find(pointEquals(dp)));
  }

  private validateAttack(params: AttackSquare, game: IGame, attacker: IPlayer) {
    const { attackerPlayerId, point } = params;
    const isPlayerTurn = game.activePlayerId === attackerPlayerId;
    const squareAlreadyAttacked = attacker.attacks.some(pointEquals(point));
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

    const gameDto = await this.getGame(game.id);
    return gameDto;
  }

  async findGame(gameId: string) {
    const game = await GameModel.findById(gameId);
    const gameDto: GameDTO | undefined = game?.toObject();
    return gameDto;
  }

  async getGame(gameId: string) {
    const game = await GameModel.findById(gameId).populate("gameRoom");
    if (!game) throw new ApiError(`Game '${gameId}' was not found`, 404);
    const gameDto: GameDTO = game.toObject();
    return gameDto;
  }

  async getGameDocument(gameId: string) {
    const game = await GameModel.findById(gameId);
    if (!game) throw new ApiError(`Game '${gameId}' was not found`, 404);
    return game;
  }

  async deleteGamesFromRoom(gameRoomId: string) {
    const gameRoom = new Types.ObjectId(gameRoomId);
    const result = await GameModel.deleteMany({ gameRoom });
    console.log(`Deleted (${result.deletedCount}) games from game room`);
  }

  async startWithRandomPlacements(gameId: string) {
    console.log("Setting random placements...");

    const game = await GameModel.findById(gameId);

    if (!game) {
      throw new Error(`Game '${gameId}' was not found`);
    }

    this.gameCreationService.randomizePlacements(game);
    game.state = GameState.PLACEMENTS;

    const updated = await game.save();

    const gameDTO: GameDTO = updated.toObject();
    return gameDTO;
  }
}
