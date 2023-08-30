import { Types } from "mongoose";
import { GameModel } from "../database/dbSchema";
import { GameDTO, GameOptions, GameState, IGame, IPlayer } from "../models";
import { createRandomFleetLocations } from "./shipGeneration";

export class GameCreationService {
  async createGame(game: IGame) {
    const created = await GameModel.create(game);
    const gameDTO: GameDTO = created.toObject();
    return gameDTO;
  }

  async createEmptyGame(options: GameOptions) {
    const emptyGame = this.generateEmptyGame(options);
    return await this.createGame(emptyGame);
  }

  generateEmptyGame({ gameRoomId, playerIds, firstPlayerId }: GameOptions) {
    const game: IGame = {
      gameRoom: new Types.ObjectId(gameRoomId),
      activePlayerId: firstPlayerId,
      players: playerIds.map<IPlayer>((pId) => ({
        playerId: new Types.ObjectId(pId),
        attacks: [],
        ownShips: [],
      })),
      state: GameState.ENDED,
    };

    return game;
  }

  randomizePlacements(game: IGame) {
    game.players.forEach((player) => {
      const placements = createRandomFleetLocations();
      player.ownShips = placements;
    });
  }
}
