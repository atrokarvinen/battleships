import mongoose from "mongoose";
import { env } from "../core/env";
import { GameModel } from "../game/database/dbSchema";
import { ShipDTO } from "../game/models/ship";
import { defaultGame } from "../testing/defaults/defaultGameDto";
import { defaultPlayer } from "../testing/defaults/defaultPlayerDto";
import { TransformShipPayload } from "./models";
import { ShipBuilderService } from "./shipBuilderService";
import { ShipBuilderValidator } from "./shipBuilderValidation";

const service = new ShipBuilderService();

beforeAll(async () => {
  jest
    .spyOn(ShipBuilderValidator.prototype, "validatePlacements")
    .mockImplementation(() => {});
  await mongoose.connect(env.DB_CONNECTION_STRING_TESTS);
});

beforeEach(async () => {
  await cleanup();
});

afterAll(async () => {
  await cleanup();
  await mongoose.connection.close();
  jest.restoreAllMocks();
});

const cleanup = async () => {
  await GameModel.deleteMany({});
};

it("confirms placements", async () => {
  const createdGame = await GameModel.create({
    ...defaultGame,
    players: [defaultPlayer],
  });
  const userId = createdGame.players[0].playerId.toString();
  const gameId = createdGame.id;

  const updatedGame = await service.confirm(userId, gameId);

  const createdPlayer = createdGame.players[0];
  const updatedPlayer = updatedGame.players[0];
  expect(createdPlayer.placementsReady).toBeFalsy();
  expect(updatedPlayer.placementsReady).toBeTruthy();
});

it("transforms ship", async () => {
  const createdGame = await GameModel.create({
    ...defaultGame,
    players: [
      {
        ...defaultPlayer,
        ownShips: [{ isVertical: false, length: 3, start: { x: 0, y: 0 } }],
      },
    ],
  });

  const originalShip = createdGame.players[0].ownShips[0];
  const transformedShip: ShipDTO = {
    ...originalShip,
    id: (originalShip as any).id,
    isVertical: !originalShip.isVertical,
    start: { x: 4, y: 7 },
  };

  const payload: TransformShipPayload = {
    gameId: createdGame.id,
    playerId: createdGame.players[0].playerId.toString(),
    ship: transformedShip as ShipDTO,
  };

  const updatedGame = await service.transformShip(payload);

  const updatedShip = updatedGame.players[0].ownShips[0];
  expect(updatedShip.start).toStrictEqual(transformedShip.start);
  expect(updatedShip.isVertical).toStrictEqual(transformedShip.isVertical);
});
