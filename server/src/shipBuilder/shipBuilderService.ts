import { GameDTO, GameState, IGame } from "../game/models";
import { GameService } from "../game/services/gameService";
import { ApiError } from "../middleware/errorHandleMiddleware";
import { TransformShipPayload } from "./models";
import { ShipBuilderValidator } from "./shipBuilderValidation";

export class ShipBuilderService {
  private gameService = new GameService();
  private validator = new ShipBuilderValidator();

  transformShip = async ({ gameId, playerId, ship }: TransformShipPayload) => {
    const game = await this.gameService.getGameDocument(gameId);

    const shipToUpdate = this.getPlayerShip(game, playerId, ship.id);
    shipToUpdate.isVertical = ship.isVertical;
    shipToUpdate.start = ship.start;

    const updatedGame = await game.save();
    const gameDto: GameDTO = updatedGame.toObject();
    return gameDto;
  };

  confirm = async (userId: string, gameId: string) => {
    const game = await this.gameService.getGameDocument(gameId);

    const player = this.getPlayer(game, userId);
    const playerShips = player.ownShips;
    this.validator.validatePlacements(game.state, playerShips);

    player.placementsReady = true;
    const bothPlayerReady = game.players.every((p) => p.placementsReady);
    if (bothPlayerReady) {
      game.state = GameState.STARTED;
    }
    const updatedGame = await game.save();
    const withGameRoom = await updatedGame.populate("gameRoom");

    const gameDto: GameDTO = withGameRoom.toObject();
    return gameDto;
  };

  private getPlayer = (game: IGame, playerId: string) => {
    const player = game.players.find((p) => p.playerId.toString() === playerId);
    if (!player) throw new ApiError("Player not found", 404);
    return player;
  };

  private getPlayerShip = (game: IGame, playerId: string, shipId: string) => {
    const ships = this.getPlayer(game, playerId).ownShips;
    const ship = ships.find((s: any) => s._id.toString() === shipId);
    if (!ship) throw new ApiError("Ship not found", 404);
    return ship;
  };
}
