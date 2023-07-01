import mongoose from "mongoose";
import { standardTotalShipSquares } from "../ship-reserve";
import { GameModel } from "./dbModel";
import { DbService } from "./dbService";
import { Game, GameState, ShipPart } from "./model";

describe("game db testing", () => {
  const service = new DbService();

  beforeAll(async () => {
    // Create
    await mongoose.connect("mongodb://localhost:27017/battleship-test");
  });

  beforeEach(async () => {
    await GameModel.deleteMany({});
  });

  afterAll(async () => {
    // Drop
    await mongoose.connection.close();
  });

  it("creates game with id", async () => {
    const gameToCreate: Game = {
      activePlayerId: "1",
      boards: [],
      playerIds: [],
      state: GameState.ENDED,
      winnerId: "2",
    };

    const createdGame = await service.createGame(gameToCreate);

    expect(createdGame.id).toBeDefined();
  });

  it("creates empty game", async () => {
    const gameToCreate: Game = {
      activePlayerId: "1",
      boards: [],
      playerIds: [],
      state: GameState.ENDED,
      winnerId: "2",
    };

    const createdGame = await service.createGame(gameToCreate);

    expect(createdGame).toMatchObject(gameToCreate);
  });

  it("creates game with single ship and square", async () => {
    const gameToCreate: Game = {
      activePlayerId: "1",
      boards: [
        {
          ships: [{ start: { x: 1, y: 2 }, isVertical: true, length: 5 }],
          squares: [
            {
              ship: ShipPart.START,
              hasBeenAttacked: true,
              hasShip: true,
              point: { x: 1, y: 2 },
              isVertical: false,
            },
          ],
          playerId: "1",
        },
      ],
      playerIds: ["1", "2"],
      state: GameState.ENDED,
      winnerId: "2",
    };

    const createdGame = await service.createGame(gameToCreate);

    expect(createdGame).toMatchObject(gameToCreate);
  });

  it("initializes a game", async () => {
    const playerIds = ["1", "2"];
    const game = await service.initializeGame(playerIds);

    expect(game.playerIds).toStrictEqual(playerIds);
    expect(game.boards).toHaveLength(playerIds.length);
    expect(game.boards[0].squares).toHaveLength(100);
    expect(game.boards.map((b) => b.playerId)).toStrictEqual(playerIds);
  });

  it("initializes a random game", async () => {
    const playerIds = ["1", "2"];
    const initialGame = await service.initializeGame(playerIds);
    const game = await service.initializeRandomGame(initialGame.id);

    expect(game.boards).toHaveLength(playerIds.length);

    const squaresWithShip = game.boards[0].squares.filter(
      (square) => square.hasShip
    );
    expect(squaresWithShip).toHaveLength(standardTotalShipSquares);
  });

  it("marks location as attacked", async () => {});
  it("destroys ship at correctly attacked location", async () => {});
  it("declares winner when all ships are lost", async () => {});
});

const defaultGame: Game = {
  activePlayerId: "0",
  boards: [],
  playerIds: [],
  state: GameState.UNKNOWN,
  winnerId: "0",
};
