import mongoose from "mongoose";
import { env } from "../core/env";
import { GameRoom, OpponentType } from "../database/gameRoom";
import { User } from "../database/user";
import { GameModel } from "../game/database/dbSchema";
import { defaultGameRoom } from "../testing/defaults/defaultGameRoom";
import { GameRoomService } from "./gameRoomService";

const service = new GameRoomService();

beforeAll(async () => {
  await mongoose.connect(env.DB_CONNECTION_STRING_TESTS);
});

beforeEach(async () => {
  await cleanup();
});

afterAll(async () => {
  await cleanup();
  await mongoose.connection.close();
});

const cleanup = async () => {
  await User.deleteMany({});
  await GameModel.deleteMany({});
  await GameRoom.deleteMany({});
};

it("creates game", async () => {
  const createdGame = await service.createGameRoom({
    createdAt: new Date(),
    createdBy: "test user",
    title: "test game",
    players: [],
    opponentType: OpponentType.HUMAN,
  });

  const expectedGame = await service.getGameRoom(createdGame.id!);
  expect(createdGame).toStrictEqual(expectedGame);
});

it("gets game in game room", async () => {
  const game = await GameModel.create({});
  const gameRoom = await GameRoom.create({
    ...defaultGameRoom,
    game: game._id,
  });
  const gameRoomId = gameRoom.id;

  const fetchedGame = await service.getGameInRoom(gameRoomId);
  expect(fetchedGame).toStrictEqual(game.toObject());
});

it("joins player to game room", async () => {
  const player = await User.create({ username: "test user", password: "pass" });
  const gameRoom = await GameRoom.create({ ...defaultGameRoom });
  const gameRoomId = gameRoom.id;
  const userId = player.id;

  await service.joinGame(gameRoomId, userId);

  const joinedGameRoom = await GameRoom.findById(gameRoomId);
  const playerIds = joinedGameRoom?.players.map((p) => p.toString());
  expect(playerIds).toContain(userId);

  const joiningPlayer = await User.findById(userId);
  const gameRoomIds = joiningPlayer?.gamesJoined.map((g) => g.toString());
  expect(gameRoomIds).toContain(gameRoomId);
});

it("player cannot join same game twice", async () => {
  const player = await User.create({ username: "test user", password: "pass" });
  const gameRoom = await GameRoom.create({
    ...defaultGameRoom,
    players: [player._id],
  });
  const gameRoomId = gameRoom.id;
  const userId = player.id;

  const act = service.joinGame(gameRoomId, userId);

  await expect(act).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Already joined to game"`
  );
});

it("player cannot join full game", async () => {
  const player = await User.create({ username: "test user", password: "pass" });
  const p1 = await User.create({ username: "p1", password: "pass" });
  const p2 = await User.create({ username: "p2", password: "pass" });
  const gameRoom = await GameRoom.create({
    ...defaultGameRoom,
    players: [p1._id, p2._id],
  });
  const gameRoomId = gameRoom.id;
  const userId = player.id;

  const act = service.joinGame(gameRoomId, userId);

  await expect(act).rejects.toThrowErrorMatchingInlineSnapshot(
    `"Game is full"`
  );
});
