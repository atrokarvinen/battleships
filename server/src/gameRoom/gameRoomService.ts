import { Types } from "mongoose";
import { UserDTO } from "../auth/models/user";
import { User } from "../auth/userSchema";
import { GameModel } from "../game/database/gameSchema";
import { GameOptions } from "../game/models";
import { GameDTO } from "../game/models/game";
import { GameCreationService } from "../game/services/gameCreationService";
import { ApiError } from "../middleware/errorHandleMiddleware";
import { GameRoom } from "./gameRoomSchema";
import { GameRoomDTO, IGameRoom } from "./models/gameRoom";
import { OpponentType } from "./models/opponentType";

export class GameRoomService {
  private gameCreationService: GameCreationService = new GameCreationService();

  async getGameRooms() {
    const games = await GameRoom.find({}).populate("players", "username");
    const gameDtos: IGameRoom[] = games.map((g) => g.toObject());
    return gameDtos;
  }

  async findGameRoom(gameId: string) {
    const game = await GameRoom.findById(gameId).populate(
      "players",
      "-password"
    );
    const gameDto: GameRoomDTO | undefined = game?.toObject();
    return gameDto;
  }

  async getGameRoom(gameId: string) {
    const gameRoom = await this.findGameRoom(gameId);
    if (!gameRoom) throw new ApiError("Gameroom not found", 404);
    return gameRoom;
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
    const gameRoomDto = gameRoom?.toObject();
    const gameDto = gameRoomDto?.game as GameDTO | undefined;
    return gameDto;
  }

  async createGameRoom(payload: IGameRoom) {
    const createdGameRoom = await GameRoom.create(payload);

    // Initialize an empty game to the newly created room
    const options: GameOptions = {
      gameRoomId: createdGameRoom.id,
      players: [],
    };
    const newGame = await this.gameCreationService.createEmptyGame(options);
    createdGameRoom.game = new Types.ObjectId(newGame.id);
    let initializedGameRoom = await createdGameRoom.save();

    const isAgainstBot = payload.opponentType === OpponentType.COMPUTER;
    if (isAgainstBot) {
      console.log("Adding bot to game");
      initializedGameRoom = await this.addBotToGame(initializedGameRoom.id);
    }

    const gameDto: IGameRoom = initializedGameRoom.toObject();
    return gameDto;
  }

  private async addBotToGame(gameRoomId: string) {
    const gameRoom = await GameRoom.findById(gameRoomId);
    if (!gameRoom) throw new Error("Failed to add bot to game, game not found");

    gameRoom.players.push({
      id: new Types.ObjectId().toString(),
      username: "AI",
      isAi: true,
    });
    const updatedGameRoom = await gameRoom.save();

    return updatedGameRoom;
  }

  async deleteGameRoom(gameRoomId: string) {
    console.log(`Deleting game room '${gameRoomId}'...`);
    const gameRoom = await GameRoom.findByIdAndDelete(gameRoomId);
    await GameModel.findByIdAndDelete(gameRoom?.game);
    console.log(`Deleted game room '${gameRoom?.title}'`);
  }

  async joinGame(gameRoomId: string, userId: string) {
    console.log(`Joining game ${gameRoomId}...`);

    const gameRoom = await this.getGameRoomDocument(gameRoomId);
    const user = await this.getUserDocument(userId);

    this.validateGameJoin(gameRoom, userId);

    gameRoom.players.push({
      id: user.id.toString(),
      username: user.username,
      isAi: false,
    });
    await gameRoom.save();

    user.gamesJoined.push(gameRoom.id);
    await user.save();

    console.log(
      `User '${user.username}', '${user.id}' joined game ${gameRoom.title}`
    );
    const joinedPlayer: UserDTO = user.toObject();
    return joinedPlayer;
  }

  async leaveGame(gameRoomId: string, userId: string) {
    console.log(`Leaving game ${gameRoomId}...`);

    const gameRoom = await this.getGameRoomDocument(gameRoomId);
    const user = await this.getUserDocument(userId);

    gameRoom.players = gameRoom.players.filter(
      (p) => p.id !== user.id.toString()
    );
    await gameRoom.save();

    user.gamesJoined = user.gamesJoined.filter((g) => !g.equals(gameRoom.id));
    await user.save();

    console.log(`User '${user.username}' left game ${gameRoom.title}`);
  }

  private async getUserDocument(userId: string) {
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw new ApiError(`User '${userId}' not found`, 404);
    }
    return user;
  }

  private async getGameRoomDocument(gameRoomId: string) {
    const gameRoom = await GameRoom.findById(gameRoomId);
    if (!gameRoom) {
      throw new ApiError(`Game room '${gameRoomId}' not found`, 404);
    }
    return gameRoom;
  }

  private validateGameJoin(game: IGameRoom, userId: string) {
    const joinedCount = game.players.length;
    if (joinedCount >= 2) {
      throw new ApiError("Game is full", 400);
    }

    const joinedPlayerIds = game.players.map((p) => p.id);
    const alreadyJoined = joinedPlayerIds.includes(userId);
    if (alreadyJoined) {
      throw new ApiError("Already joined to game", 400);
    }
  }
}
