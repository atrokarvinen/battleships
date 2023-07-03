import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { Server } from "socket.io";
import { env } from "../core/env";
import { GameRoom, IGameRoom } from "../database/gameRoom";
import { IUser, User } from "../database/user";
import { GameModel } from "../game/database/dbModel";
import { ApiError } from "../middleware/errorHandleMiddleware";

// TODO Check use of ids and equality comparisons
export class GameRoomController {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async getGameRooms(req: Request, res: Response, next: NextFunction) {
    const games = await GameRoom.find({}).populate("players");
    try {
      const convertedGames = games.map((g) => g.toObject());

      // TODO refactor conversion hack
      const conv = convertedGames.map((g) => ({
        ...g,
        players: g.players.map((gp: any) => ({ ...gp, name: gp.username })),
      }));
      return res.json(conv);
    } catch (error) {
      return next(error);
    }
  }

  async getGameRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const gameId = req.params.id;
      const game = await GameRoom.findById(gameId).populate("players");
      if (game === null) {
        return res.status(403).end();
      }
      const convertedGame = game.toObject();
      // TODO Refactor conversion hack
      const conv = {
        ...convertedGame,
        players: game.players.map((gp: any) => ({
          id: gp.id.toString(),
          username: gp.username,
        })),
      };
      return res.json(conv);
    } catch (error) {
      next(error);
    }
  }

  async getGameInRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const { id: gameRoomId } = req.params;
      console.log(`Getting game in game room '${gameRoomId}'...`);
      const game = await GameModel.findOne({ gameRoomId });
      if (!game) {
        return res
          .status(404)
          .json({ error: `Game in game room '${gameRoomId}' not found` });
      }
      console.log(`Found game in game room '${gameRoomId}'`);
      const gameDto = game.toObject();
      return res.json({ game: gameDto });
    } catch (error) {
      next(error);
    }
  }

  async createGameRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const payload: IGameRoom = req.body;
      const createdGame = await GameRoom.create(payload);
      const convertedGame = createdGame.toObject();
      this.io.emit("gameCreated", convertedGame);
      return res.json(convertedGame);
    } catch (error) {
      next(error);
    }
  }

  async deleteGameRoom(req: Request, res: Response, next: NextFunction) {
    try {
      const gameId = req.params.id;
      console.log(`Deleting game with id ${gameId}...`);
      const deletedGame = await GameRoom.findByIdAndDelete(gameId);
      this.io.emit("gameDeleted", gameId);
      console.log(`Deleted game '${deletedGame?.title}'`);
      return res.end();
    } catch (error) {
      next(error);
    }
  }

  async joinGame(req: Request, res: Response, next: NextFunction) {
    try {
      const gameId = req.body.gameId;

      console.log(`Joining game ${gameId}...`);

      // TODO use auth middleware
      const cookie = req.cookies[env.JWT_COOKIE_NAME];
      if (!cookie) {
        return res.status(403).end();
      }

      const token = jwt.verify(cookie, env.JWT_SECRET);
      const userId = (token as any).userId;

      const game = await GameRoom.findById(gameId);
      if (!game) {
        return res.status(404).end();
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: `User '${userId}' not found` });
      }
      this.validateGameJoin(game, user);

      game.players.push(user.id);
      await game.save();

      user.games.push(game.id);
      await user.save();

      this.io.emit("gameJoined", {
        gameId,
        playerId: userId,
        player: { id: userId, username: user.username },
      });
      console.log(`User '${userId}' joined game ${game.title}`);
      return res.end();
    } catch (error) {
      next(error);
    }
  }

  validateGameJoin(game: IGameRoom, user: IUser) {
    const joinedCount = game.players.length;
    if (joinedCount >= 2) {
      throw new ApiError("Game is full", 400);
    }

    const joinedPlayerIds = game.players.map((p) => p._id.toString());
    const alreadyJoined = joinedPlayerIds.includes(user.id!!);
    if (alreadyJoined) {
      throw new ApiError("Already joined to game", 400);
    }
  }

  async leaveGame(req: Request, res: Response, next: NextFunction) {
    try {
      const gameId = req.body.gameId;

      console.log(`Leaving game ${gameId}...`);

      // TODO use auth middleware
      const cookie = req.cookies[env.JWT_COOKIE_NAME];
      if (!cookie) {
        return res.status(403).end();
      }

      const token = jwt.verify(cookie, env.JWT_SECRET);
      const userId = (token as any).userId;

      const game = await GameRoom.findById(gameId);
      if (!game) {
        return res.status(404).end();
      }

      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: `User '${userId}' not found` });
      }
      game.players = game.players.filter((p) => !p.equals(user.id));
      await game.save();

      user.games = user.games.filter((g) => !g.equals(game.id));
      await user.save();

      this.io.emit("gameLeft", { gameId, playerId: userId });
      console.log(`User '${userId}' left game ${game.title}`);
      return res.end();
    } catch (error) {
      next(error);
    }
  }
}
