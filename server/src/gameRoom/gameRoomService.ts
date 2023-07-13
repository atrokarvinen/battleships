import { Types } from "mongoose";
import { GameRoom, IGameRoom } from "../database/gameRoom";
import { User } from "../database/user";
import { GameDTO } from "../game/models/game";
import { ApiError } from "../middleware/errorHandleMiddleware";

export class GameRoomService {
  async getGameRooms() {
    const games = await GameRoom.find({}).populate("players", "username");
    const gameDtos: IGameRoom[] = games.map((g) => g.toObject());
    return gameDtos;
  }

  async getGameRoom(gameId: string) {
    const game = await GameRoom.findById(gameId).populate(
      "players",
      "username"
    );
    const gameDto: IGameRoom | undefined = game?.toObject();
    return gameDto;
  }

  async setGameInRoom(gameRoomId: string, id: string) {
    const gameRoom = await GameRoom.findById(gameRoomId);
    if (!gameRoom) {
      throw new ApiError(`Game room '${gameRoomId}' not found`, 404);
    }
    gameRoom.game = new Types.ObjectId(id);
    await gameRoom.save();
  }

  async getGameInRoom(gameRoomId: string) {
    console.log(`Getting game in game room '${gameRoomId}'...`);
    const gameRoom = await GameRoom.findById(gameRoomId).populate("game");
    console.log(`Found game in game room '${gameRoomId}'`);
    const gameRoomDto: any = gameRoom?.toObject();
    const gameDto: GameDTO | undefined = gameRoomDto?.game;
    return gameDto;
  }

  async createGameRoom(payload: IGameRoom) {
    const createdGame = await GameRoom.create(payload);
    const gameDto: IGameRoom = createdGame.toObject();
    return gameDto;
  }

  async deleteGameRoom(gameRoomId: string) {
    console.log(`Deleting game room '${gameRoomId}'...`);
    await GameRoom.findByIdAndDelete(gameRoomId);
    console.log(`Deleted game room '${gameRoomId}'`);
  }

  async joinGame(gameRoomId: string, userId: string) {
    console.log(`Joining game ${gameRoomId}...`);

    const gameRoom = await GameRoom.findById(gameRoomId);
    if (!gameRoom) {
      throw new ApiError(`Game room '${gameRoomId}' not found`, 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(`User '${userId}' not found`, 404);
    }
    this.validateGameJoin(gameRoom, userId);

    gameRoom.players.push(user.id);
    await gameRoom.save();

    user.games.push(gameRoom.id);
    await user.save();

    console.log(`User '${userId}' joined game ${gameRoom.title}`);

    return user.username;
  }

  async leaveGame(gameRoomId: string, userId: string) {
    console.log(`Leaving game ${gameRoomId}...`);

    const gameRoom = await GameRoom.findById(gameRoomId);
    if (!gameRoom) {
      throw new ApiError(`Game room '${gameRoomId}' not found`, 404);
    }

    const user = await User.findById(userId);
    if (!user) {
      throw new ApiError(`User '${userId}' not found`, 404);
    }

    gameRoom.players = gameRoom.players.filter((p) => !p.equals(user.id));
    await gameRoom.save();

    user.games = user.games.filter((g) => !g.equals(gameRoom.id));
    await user.save();

    console.log(`User '${userId}' left game ${gameRoom.title}`);
  }

  validateGameJoin(game: IGameRoom, userId: string) {
    const joinedCount = game.players.length;
    if (joinedCount >= 2) {
      throw new ApiError("Game is full", 400);
    }

    const joinedPlayerIds = game.players.map((p) => p.toString());
    const alreadyJoined = joinedPlayerIds.includes(userId);
    if (alreadyJoined) {
      throw new ApiError("Already joined to game", 400);
    }
  }
}
