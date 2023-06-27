import { Game, GameType, IGame } from "./DbGame";
import { ObjectId, Types } from "mongoose";
import { IPlayer } from "./DbPlayer";

export interface IGameService {
  createGame(game: IGame): Promise<GameType>;
}

export class GameService implements IGameService {
  async createGame(game: IGame) {
    const { players, title } = game;
    const created = await Game.create({
      players,
      title,
    });

    const converted: GameType = created.toObject();

    return await this.getGameById(created._id.toString());
  }

  async getGameById(id: string) {
    const path: keyof IGame = "players";
    const game = await Game.findById(id).populate(path);

    if (!game) {
      throw new Error("game not found");
    }

    console.log("game:", game);

    const converted: GameType = game.toObject();

    console.log("converted:", converted);
    return converted;
  }

  async addPlayerToGame(gameId: string, player: IPlayer) {
    const game = await Game.findById(gameId);

    if (!game) {
      throw new Error("game not found");
    }

    game.players.push({ name: player.name, games: [] });
    await game.save();

    return await this.getGameById(gameId);
  }
}
