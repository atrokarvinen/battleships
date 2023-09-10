import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { GameRoomService } from "../gameRoom/gameRoomService";
import { GameRoomDTO } from "../gameRoom/models/gameRoom";
import { OpponentType } from "../gameRoom/models/opponentType";
import { ApiError } from "../middleware/errorHandleMiddleware";
import { throwInvalidStateError } from "../shipBuilder/shipBuilderValidation";
import { StartGamePayload } from "./api/startGamePayload";
import { GameState, Point } from "./models";
import { GameOptions } from "./models/gameOptions";
import { AttackService } from "./services/attackService";
import { pointsEqual } from "./services/board-utils";
import { GameService } from "./services/gameService";
import { filterGameInfo } from "./services/info-filter";

export class GameController {
  private gameDbService = new GameService();
  private gameRoomService = new GameRoomService();
  private attackService = new AttackService();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  startGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const { gameRoomId }: StartGamePayload = req.body;

      console.log("Starting game:", req.body);

      const gameRoom = await this.gameRoomService.getGameRoom(gameRoomId);
      let game = await this.gameRoomService.getGameInRoom(gameRoomId);

      this.validateGameStart(userId, gameRoom, game?.state);

      const options = this.createGameOptions(userId, gameRoom);
      if (!game) {
        console.log("Creating new game");
        game = await this.gameDbService.createEmptyGame(options);
        await this.gameRoomService.setGameInRoom(gameRoomId, game.id);
      } else {
        console.log("Resetting old game");
        game = await this.gameDbService.resetGame(options);
      }
      const startedGame = await this.gameDbService.startWithRandomPlacements(
        game.id
      );

      const { selfInfo, opponentInfo } = filterGameInfo(
        req.userId,
        startedGame
      );

      console.log("Started game:", startedGame.id);
      this.io
        .to(gameRoomId)
        .except(req.socketId)
        .emit("gameStarted", opponentInfo);
      return res.json(selfInfo);
    } catch (error) {
      next(error);
    }
  };

  private validateGameStart(
    userId: string,
    gameRoom: GameRoomDTO,
    state: GameState | undefined
  ) {
    const hasTwoPlayers = gameRoom.players.length === 2;
    if (!hasTwoPlayers) {
      throw new ApiError("Game requires 2 players");
    }

    const startedByEitherPlayer = gameRoom.players.some((p) => p.id === userId);
    if (!startedByEitherPlayer) {
      throw new ApiError("Game may only be started by a user in the game");
    }

    const isCorrectStateToStart =
      state === undefined || state === GameState.ENDED;
    if (!isCorrectStateToStart) {
      throwInvalidStateError(state, GameState.ENDED);
    }
  }

  private createGameOptions(userId: string, gameRoom: GameRoomDTO) {
    const gameRoomId = gameRoom.id;
    const playerIds = gameRoom.players.map((p) => p.id);
    const isAgainstAi = gameRoom.opponentType === OpponentType.COMPUTER;
    const firstPlayerId = this.randomizeFirstPlayer(playerIds);
    console.log("First player:", firstPlayerId);
    const options: GameOptions = {
      gameRoomId,
      players: playerIds.map((id) => ({
        id,
        isAi: id !== userId && isAgainstAi,
      })),
      firstPlayerId,
    };
    return options;
  }

  attackSquare = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { point, attackerPlayerId, gameId } = req.body;
      const params = { point, attackerPlayerId, gameId };
      const attackResultDto = await this.attackService.attack(params);
      const game = await this.gameDbService.getGame(gameId);
      this.io
        .to(game.gameRoom.id)
        .except(req.socketId)
        .emit("squareAttacked", attackResultDto);
      return res.json(attackResultDto);
    } catch (error) {
      next(error);
    }
  };

  getAiAttack = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = req.userId;
      const { gameRoomId } = req.params;

      const game = await this.gameRoomService.getGameInRoom(gameRoomId);
      if (!game) return res.status(404).json({ error: "Game not found" });

      const gameId = game.id;
      const attacker = game.players.find((p) => p.playerId !== userId);
      if (!attacker) return res.status(404).json({ error: "Bot not found" });

      const attackerPlayerId = attacker.playerId;
      const attackedPoints = attacker.attacks;
      const point = this.generateRandomAttackPoint(attackedPoints);
      const params = { point, attackerPlayerId, gameId };
      const attackResultDto = await this.attackService.attack(params);
      this.io
        .to(gameRoomId)
        .except(req.socketId)
        .emit("squareAttacked", attackResultDto);
      return res.json(attackResultDto);
    } catch (error) {
      next(error);
    }
  };

  private generateRandomAttackPoint(attackedPoints: Point[]) {
    const boardSize = 10;
    const maxIter = 1000;
    let step = 0;
    while (step < maxIter) {
      const randomPoint = {
        x: Math.round(Math.random() * boardSize - 0.5),
        y: Math.round(Math.random() * boardSize - 0.5),
      };
      const isAlreadyAttacked = attackedPoints.some(pointsEqual(randomPoint));
      if (!isAlreadyAttacked) {
        return randomPoint;
      }
      step++;
    }
    throw new ApiError("No valid point found to attack", 400);
  }

  private randomizeFirstPlayer(playerIds: string[]) {
    const playerCount = playerIds.length;
    const startingIndex = Math.round((Math.random() - 0.5) * playerCount);
    const firstPlayerId = playerIds[startingIndex];
    return firstPlayerId;
  }

  endGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gameRoomId } = req.body;
      const currentGame = await this.gameRoomService.getGameInRoom(gameRoomId);
      const game = await this.gameDbService.resetGame({
        gameRoomId,
        players: currentGame!.players.map((p) => ({
          id: p.playerId,
          isAi: p.isAi,
        })),
      });
      const otherPlayer = game.players.find((p) => p.playerId !== req.userId);
      game.winnerPlayerId = otherPlayer?.playerId;
      this.io.to(gameRoomId).except(req.socketId).emit("gameEnded", game);
      res.json(game);
    } catch (error) {
      next(error);
    }
  };
}
