import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import { GameRoomService } from "../gameRoom/gameRoomService";
import { StartGamePayload } from "./api/startGamePayload";
import { GameDTO } from "./models";
import { GameOptions } from "./models/gameOptions";
import { AttackService } from "./services/attackService";
import { GameService } from "./services/gameService";

export class GameController {
  private gameDbService = new GameService();
  private gameRoomService = new GameRoomService();
  private attackService = new AttackService();
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async startGame(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameRoomId }: StartGamePayload = req.body;

      console.log("Starting game:", req.body);

      const gameRoom = await this.gameRoomService.getGameRoom(gameRoomId);
      if (!gameRoom) {
        return res.status(404).json({ error: `Game room not found` });
      }
      let game = await this.gameRoomService.getGameInRoom(gameRoomId);
      const playerIds = gameRoom.players.map((p) => p.id);
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

      const selfInfo = this.filterGameInfo(requester!.playerId, startedGame);
      const opponentInfo = this.filterGameInfo(opponent!.playerId, startedGame);

      console.log("Started game:", startedGame.id);
      this.io
        .to(gameRoomId)
        .except(req.socketId)
        .emit("gameStarted", opponentInfo);
      return res.json(selfInfo);
    } catch (error) {
      next(error);
    }
  }

  private filterGameInfo = (requesterId: string, gameDto: GameDTO) => {
    const requester = gameDto.players.find((p) => p.playerId === requesterId);
    const notPlayingInGame = !requester;
    if (notPlayingInGame) {
      return gameDto;
    }
    const filteredGameDto = {
      ...gameDto,
      players: [],
      primaryBoard: requester.ownShips,
      trackingBoard: requester.attacks,
    };
    return filteredGameDto;
  };

  async attackSquare(req: Request, res: Response, next: NextFunction) {
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
  }

  private randomizeFirstPlayer(playerIds: string[]) {
    const playerCount = playerIds.length;
    // Todo fix seeding for tests
    // const startingIndex = Math.round((Math.random() - 0.5) * playerCount);
    const startingIndex = 0;
    const firstPlayerId = playerIds[startingIndex];
    return firstPlayerId;
  }

  async endGame(req: Request, res: Response, next: NextFunction) {
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
  }
}
