import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { GameRoomService } from "../gameRoom/gameRoomService";
import { ApiError } from "../middleware/errorHandleMiddleware";
import { StartGamePayload } from "./api/startGamePayload";
import { Point } from "./models";
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
      const { gameRoomId }: StartGamePayload = req.body;

      console.log("Starting game:", req.body);

      const gameRoom = await this.gameRoomService.getGameRoom(gameRoomId);
      if (!gameRoom) {
        return res.status(404).json({ error: `Game room not found` });
      }
      let game = await this.gameRoomService.getGameInRoom(gameRoomId);
      const playerIds = gameRoom.players.map((p) => p.id);
      if (playerIds.length !== 2) {
        return res.status(400).json({ error: `Game requires 2 players` });
      }
      const firstPlayerId = this.randomizeFirstPlayer(playerIds);
      const options: GameOptions = { gameRoomId, playerIds, firstPlayerId };
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

      // Return only information that is visible to the player
      const requester = startedGame.players.find(
        (p) => p.playerId === req.userId
      );
      const opponent = startedGame.players.find(
        (p) => p.playerId !== req.userId
      );

      const selfInfo = filterGameInfo(requester!.playerId, startedGame);
      const opponentInfo = filterGameInfo(opponent!.playerId, startedGame);

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
      console.log("gameRoomId:", gameRoomId);

      const game = await this.gameRoomService.getGameInRoom(gameRoomId);
      if (!game) return res.status(404).json({ error: "Game not found" });

      const gameId = game.id;
      const attacker = game.players.find((p) => p.playerId !== userId);
      if (!attacker) return res.status(404).json({ error: "Bot not found" });

      const attackerPlayerId = attacker.playerId;
      const attackedPoints = attacker.attacks
        .filter((a) => a.hasBeenAttacked)
        .map((a) => a.point);
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
      const isAlreadyAttacked = attackedPoints.some((ap) =>
        pointsEqual(ap, randomPoint)
      );
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
        playerIds: currentGame!.players.map((p) => p.playerId),
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
