import { GameRoom, IGameRoom } from "./gameRoom";
import { IPlayer, Player } from "./player";

export const TestPlayer = async () => {
  console.log("Creating new player...");

  await cleanup();

  const gameToCreate1: IGameRoom = { title: "test game #1", players: [] };
  const createdGame1 = await GameRoom.create(gameToCreate1);
  console.log("Created game1:", createdGame1);

  const gameToCreate2: IGameRoom = { title: "test game #2", players: [] };
  const createdGame2 = await GameRoom.create(gameToCreate2);
  console.log("Created game2:", createdGame2);

  const player: IPlayer = {
    name: "atro",
    games: [createdGame1.id, createdGame2.id],
  };
  const created = await Player.create(player);
  console.log("Created player:", created);

  const fetched = await Player.findById(created.id).populate<{
    games: IGameRoom[];
  }>("games");

  if (!fetched) return;

  const game = fetched.games[0];
  console.log("Fetched player:", fetched.id);
  console.log("Populated games:", fetched.games);
  console.log("Game id:", game.id);
  const convertedGame: IGameRoom = {
    id: game.id,
    title: game.title,
    players: game.players,
  };
  console.log("Converted game:", convertedGame);
  const json = fetched.toJSON({ virtuals: true });
  // const object: MyPlayer = fetched.toObject(toObjectOptions());
  const object: MyPlayer = fetched.toObject();

  console.log("json:", json);
  console.log("object:", object);
};

interface MyPlayer {
  id: string;
  name: string;
  games: { id: string; title: string };
}

const cleanup = async () => {
  await GameRoom.deleteMany({});
  await Player.deleteMany({});
};
