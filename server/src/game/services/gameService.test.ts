import mongoose, { HydratedDocument } from "mongoose";
import { Game, GameType, IGame } from "./DbGame";
import { Player } from "./DbPlayer";
import { GameService } from "./gameService";
import _ from "lodash";
import { convertMongo } from "./utils";

describe("game db testing", () => {
  beforeAll(async () => {
    // Create
    await mongoose.connect("mongodb://localhost:27017/battleship-test");
  });

  afterEach(async () => {
    await Player.deleteMany({});
    await Game.deleteMany({});
  });

  afterAll(async () => {
    // Drop
    await mongoose.connection.close();
  });

  it("creates game", async () => {
    const service = new GameService();
    const gameToCreate: IGame = {
      players: [],
      title: "tester",
    };

    const createdGame = await service.createGame(gameToCreate);

    console.log("createdGame:", createdGame);

    expect(_.omit(createdGame, "id")).toStrictEqual(gameToCreate);
    expect(createdGame.players).toStrictEqual(gameToCreate.players);
    expect(createdGame.title).toEqual(gameToCreate.title);
  });

  it("creates players", async () => {
    const service = new GameService();
    const p1 = await Player.create({ name: "p1", games: [] });
    const p2 = await Player.create({ name: "p2", games: [] });

    const gameToCreate: IGame = {
      //   players: [p1._id.toString(), p2._id.toString()],
      players: [],
      title: "test title",
    };

    let createdGame = await service.createGame(gameToCreate);
    await service.addPlayerToGame(createdGame.id, { name: "p1", games: [] });
    await service.addPlayerToGame(createdGame.id, { name: "p2", games: [] });
    createdGame = await service.getGameById(createdGame.id);

    // console.log("created:", createdGame);

    expect(createdGame.title).toBe(gameToCreate.title);
    expect(createdGame.players.length).toBe(2);

    const playerNames = createdGame.players.map((p) => p.name);
    expect(playerNames).toStrictEqual(["p1", "p2"]);
  });
});
