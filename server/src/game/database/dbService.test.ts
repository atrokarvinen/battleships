import mongoose from "mongoose";
import { Game } from "../models/game";
import { GameState } from "../models/gameState";
import { standardTotalShipSquares } from "../services/ship-reserve";
import { GameModel } from "./dbSchema";
import { DbService } from "./dbService";

// TODO Tests broken after Boards was replaced with PlayerInformation
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
      gameRoomId: "1",
      playerInfos: [],
      activePlayerId: "1",
      playerIds: [],
      state: GameState.ENDED,
      winnerId: "2",
    };

    const createdGame = await service.createGame(gameToCreate);

    expect(createdGame.id).toBeDefined();
  });

  it("creates empty game", async () => {
    const gameToCreate: Game = {
      gameRoomId: "1",
      playerInfos: [],
      activePlayerId: "1",
      playerIds: [],
      state: GameState.ENDED,
      winnerId: "2",
    };

    const createdGame = await service.createGame(gameToCreate);

    expect(createdGame).toMatchObject(gameToCreate);
  });

  it("creates game with single ship and square", async () => {
    const gameToCreate: Game = {
      gameRoomId: "1",
      playerInfos: [],
      activePlayerId: "1",
      playerIds: ["1", "2"],
      state: GameState.ENDED,
      winnerId: "2",
    };

    const createdGame = await service.createGame(gameToCreate);

    expect(createdGame).toMatchObject(gameToCreate);
  });

  it("initializes a game", async () => {
    const playerIds = ["1", "2"];
    const game = await service.initializeGame("1", playerIds);

    expect(game.playerIds).toStrictEqual(playerIds);
    // expect(game.boards).toHaveLength(playerIds.length);
    // expect(game.boards[0].squares).toHaveLength(100);
    // expect(game.boards.map((b) => b.playerId)).toStrictEqual(playerIds);
  });

  it("initializes a random game", async () => {
    const playerIds = ["1", "2"];
    const initialGame = await service.initializeGame("1", playerIds);
    const game = await service.initializeRandomGame(initialGame.id);

    expect(game.playerInfos).toHaveLength(playerIds.length);

    const squaresWithShip = game.playerInfos[0].ownShips;
    expect(squaresWithShip).toHaveLength(standardTotalShipSquares);
  });

  it("marks location as attacked", async () => {});
  it("destroys ship at correctly attacked location", async () => {});
  it("declares winner when all ships are lost", async () => {});
});

const defaultGame: Game = {
  gameRoomId: "0",
  playerInfos: [],
  activePlayerId: "0",
  playerIds: [],
  state: GameState.UNKNOWN,
  winnerId: "0",
};
