import mongoose from "mongoose";
import _ from "lodash";
import { GameModel } from "./dbModel";
import { DbService } from "./dbService";
import { BoatPart, Game, GameState } from "./model";
import { standardReserve, standardTotalBoatSquares } from "../boat-reserve";

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

  it("creates game with single boat and cell", async () => {
    const gameToCreate: Game = {
      activePlayerId: "1",
      boards: [
        {
          boats: [{ start: { x: 1, y: 2 }, isVertical: true, length: 5 }],
          cells: [
            {
              boat: BoatPart.START,
              hasBeenGuessed: true,
              hasBoat: true,
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
    expect(game.boards[0].cells).toHaveLength(100);
    expect(game.boards.map((b) => b.playerId)).toStrictEqual(playerIds);
  });

  it("initializes a random game", async () => {
    const playerIds = ["1", "2"];
    const initialGame = await service.initializeGame(playerIds);
    const game = await service.initializeRandomGame(initialGame.id);

    expect(game.boards).toHaveLength(playerIds.length);

    const cellsWithBoat = game.boards[0].cells.filter((cell) => cell.hasBoat);
    expect(cellsWithBoat).toHaveLength(standardTotalBoatSquares);
  });

  it("marks location as guessed", async () => {});
  it("destroys boat at correctly guessed location", async () => {});
  it("declares winner when all boats are lost", async () => {});
});

const defaultGame: Game = {
  activePlayerId: "0",
  boards: [],
  playerIds: [],
  state: GameState.UNKNOWN,
  winnerId: "0",
};
