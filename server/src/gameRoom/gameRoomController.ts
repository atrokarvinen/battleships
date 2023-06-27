import { Server } from "socket.io";
import { GameRoom, IGameRoom } from "../database/gameRoom";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { env } from "../core/env";
import { IUser, User } from "../database/user";
import { Document, Types } from "mongoose";
import { ApiError } from "../middleware/errorHandleMiddleware";

export class GameRoomController {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  async getGameRooms(req: Request, res: Response, next: NextFunction) {
    const games = await GameRoom.find({}).populate("players");
    try {
      const convertedGames = games.map((g) => g.toObject());
      const conv = convertedGames.map((g) => ({
        ...g,
        players: g.players.map((gp: any) => ({ ...gp, name: gp.username })),
      }));
      // return res.json(convertedGames);
      return res.json(conv);
    } catch (error) {
      console.log(
        `Failed to convert games ${JSON.stringify(games)} to games: ${error}`
      );
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

  async deleteAllGameRooms(req: Request, res: Response, next: NextFunction) {
    try {
      const gameId = req.params.id;
      console.log(`Deleting all games...`);
      const { deletedCount } = await GameRoom.deleteMany({});
      this.io.emit("allGamesDeleted", gameId);
      console.log(`Deleted all games, count: ${deletedCount}`);
      return res.end();
    } catch (error) {
      next(error);
    }
  }

  async joinGame(req: Request, res: Response, next: NextFunction) {
    try {
      const gameId = req.body.gameId;

      console.log(`Joining game ${gameId}...`);

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

    const joinedPlayerIds = game.players.map((p) => p.id.toString());
    const joinedPlayerIds2 = game.players.map((p) => p._id.toString());
    const alreadyJoined = joinedPlayerIds2.includes(user.id!!);
    if (alreadyJoined) {
      throw new ApiError("Already joined to game", 400);
    }
  }

  async leaveGame(req: Request, res: Response, next: NextFunction) {
    try {
      const gameId = req.body.gameId;

      console.log(`Leaving game ${gameId}...`);

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
