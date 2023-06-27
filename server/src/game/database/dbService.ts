import { createRandomFleetLocations } from "../boatGeneration";
import { GameModel } from "./dbModel";
import { Board, BoatPart, Cell, Game, GameState, Point } from "./model";

type GameDTO = Game & { id: string };

export class DbService {
  async getGameByRoomId(gameRoomId: string) {
    const game = await GameModel.findOne({ gameRoomId });
    const gameDto: GameDTO | undefined = game?.toObject();
    return gameDto;
  }

  async guessCell({
    point,
    gameId,
    guesserPlayerId,
  }: {
    point: any;
    guesserPlayerId: string;
    gameId: string;
  }) {
    const { x, y } = point;
    console.log(`Guessing point (${x}, ${y})`);

    const game = await GameModel.findById(gameId);
    if (!game) {
      throw new Error(`Failed to find game '${gameId}'`);
    }
    const infos = game.playerInfos;
    const own = infos.find((b) => b.playerId === guesserPlayerId);
    const enemy = infos.find((b) => b.playerId !== guesserPlayerId);
    if (!own || !enemy) {
      throw new Error(`Failed to find board of player '${guesserPlayerId}'`);
    }
    const guessedCellOwnSide = own.guesses.find(pointMatches(point));
    const guessedCellEnemySide = enemy.ownShips.find(pointMatches(point));
    if (!guessedCellOwnSide || !guessedCellEnemySide) {
      throw new Error(`Failed to find cell at point '${point}'`);
    }
    guessedCellOwnSide.boat = guessedCellEnemySide.boat;
    guessedCellOwnSide.isVertical = guessedCellEnemySide.isVertical;
    guessedCellOwnSide.hasBoat = guessedCellEnemySide.hasBoat;
    guessedCellOwnSide.hasBeenGuessed = true;
    guessedCellEnemySide.hasBeenGuessed = true;

    const shipHit = guessedCellEnemySide.hasBoat;
    const otherPlayer = game.playerIds.find((pId) => pId !== guesserPlayerId);
    const nextPlayerId = shipHit ? guesserPlayerId : otherPlayer!;

    game.activePlayerId = nextPlayerId;

    const isGameOver = enemy.ownShips
      .filter((x) => x.hasBoat)
      .every((x) => x.hasBeenGuessed);

    if (isGameOver) {
      game.winnerId = guesserPlayerId;
    }

    console.log("Point guessed. hasBoat:", guessedCellEnemySide.hasBoat);
    console.log("Is game over:", isGameOver);

    const updatedGame = await game.save();

    return { shipHit, nextPlayerId, isGameOver };
  }

  async getGame(id: string) {
    const dbGame = await GameModel.findById(id);
    const game: Game | undefined = dbGame?.toObject();
    return game;
  }

  async createGame(game: Game) {
    const created = await GameModel.create(game);
    const gameDTO: GameDTO = created.toObject();
    return gameDTO;
  }

  async deleteGamesFromRoom(gameRoomId: string) {
    const result = await GameModel.deleteMany({ gameRoomId });
    console.log(`Deleted (${result.deletedCount}) games from game room`);
  }

  async initializeGame(gameRoomId: string, playerIds: string[]) {
    const game: Game = {
      gameRoomId,
      activePlayerId: playerIds[0],
      // boards: playerIds.map((pId) => createEmptyBoard(pId)),
      playerInfos: playerIds.map((pId) => ({
        playerId: pId,
        guesses: createEmptyBoardCells(10),
        ownShips: createEmptyBoardCells(10),
      })),
      playerIds,
      state: GameState.STARTED,
      winnerId: "0",
    };

    return this.createGame(game);
  }

  async initializeRandomGame(gameId: string) {
    const game = await GameModel.findById(gameId);

    if (!game) {
      throw new Error(`Game '${gameId}' was not found`);
    }

    const players = game.playerIds;
    players.forEach((playerId) => {
      const board = game.playerInfos.find((b) => b.playerId === playerId);
      if (!board) {
        throw new Error(`Board of player '${playerId}' was not found`);
      }

      const placements = createRandomFleetLocations();
      placements.forEach((placement) => {
        const { takenPoints, isVertical, start, end } = placement;
        takenPoints.forEach((boatPoint) => {
          const cell = board.ownShips.find(pointMatches(boatPoint));
          if (!cell) {
            const { x, y } = boatPoint;
            throw new Error(`Cell (${x}, ${y}) not found`);
          }
          const isStart = pointsMatch(start, boatPoint);
          const isEnd = pointsMatch(end, boatPoint);

          // Mutate cell
          cell.hasBoat = true;
          cell.boat = isStart
            ? BoatPart.START
            : isEnd
            ? BoatPart.END
            : BoatPart.MIDDLE;
          cell.isVertical = isVertical;
        });
      });
    });

    const updated = await game.save();
    const gameDTO: GameDTO = updated.toObject();
    return gameDTO;
  }
}

export const createEmptyBoardCells = (boardSize: number) => {
  const arr = Array.from(Array(boardSize)).map((_, index) => index);
  const cells: Cell[] = arr
    .map((row) => {
      return arr.map((column) => {
        const cell: Cell = {
          boat: BoatPart.UNKNOWN,
          hasBeenGuessed: false,
          hasBoat: false,
          isVertical: false,
          point: { x: column, y: row },
        };
        return cell;
      });
    })
    .flat();
  return cells;
};

export const createEmptyBoard = (playerId: string) => {
  const boardSize = 10;
  const board: Board = {
    playerId,
    cells: createEmptyBoardCells(boardSize),
    boats: [],
  };
  return board;
};

export const pointsMatch = (pointA: Point, pointB: Point) => {
  return pointA.x === pointB.x && pointA.y === pointB.y;
};

export const pointMatches = (pointA: Point) => (cell: Cell) => {
  const pointB = cell.point;
  return pointsMatch(pointA, pointB);
};
