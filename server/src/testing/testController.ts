import { Request, Response } from "express";
import { GameRoom } from "../database/gameRoom";
import { User } from "../database/user";
import { GameModel } from "../game/database/dbModel";
import { pointsMatch } from "../game/database/dbService";
import { BoatPart, Cell } from "../game/database/model";
import { GameSeed, Point } from "./models";

export class TestController {
  deleteAllUsers = async (req: Request, res: Response) => {
    await User.deleteMany({});
    res.end();
  };

  deleteUserByName = async (req: Request, res: Response) => {
    const username = req.params.name;
    await User.deleteMany({ username });
    res.end();
  };

  deleteGameByTitle = async (req: Request, res: Response) => {
    const title = req.params.title;
    await GameRoom.deleteMany({ title });
    res.end();
  };

  deleteGamesFromGameRoom = async (req: Request, res: Response) => {
    const title = req.params.title;
    const gameRoom = await GameRoom.findOne({ title });
    if (!gameRoom) {
      return res
        .status(404)
        .json({ error: `game room '${title}' not found` })
        .end();
    }
    await GameModel.deleteMany({ gameRoomId: gameRoom._id });
    res.end();
  };

  seedGame = async (req: Request, res: Response) => {
    const seed: GameSeed = req.body;
    const { gameRoomId, shipPositions } = seed;

    const game = await GameModel.findOne({ gameRoomId });
    if (!game) {
      return res
        .status(404)
        .json({ error: `game '${gameRoomId}' not found` })
        .end();
    }
    if (shipPositions.length !== 2) {
      return res
        .status(400)
        .json({ error: "Must have exactly two players" })
        .end();
    }

    const positions1 = shipPositions[0].shipPoints;
    const positions2 = shipPositions[1].shipPoints;
    const playerName1 = shipPositions[0].playerId;
    const playerName2 = shipPositions[1].playerId;
    const player1 = await User.findOne({ username: playerName1 });
    const player2 = await User.findOne({ username: playerName2 });
    const p1 = game.playerInfos.find(
      (p) => p.playerId === player1?.id?.toString()
    );
    const p2 = game.playerInfos.find(
      (p) => p.playerId === player2?.id?.toString()
    );
    if (!p1 || !p2) {
      return res
        .status(404)
        .json({ error: "player 1 or player 2 not found" })
        .end();
    }

    this.setPositions(positions1, p1.ownShips);
    this.setPositions(positions2, p2.ownShips);

    await game.save();
    return res.end();
  };

  setPositions(positions: Point[], ships: Cell[]) {
    ships.forEach((s) => {
      s.hasBoat = false;
      s.boat = BoatPart.UNKNOWN;
    });
    positions.forEach((pos) => {
      const square = ships.find((s) => pointsMatch(s.point, pos));
      if (!square) {
        throw new Error(`square not found at ${pos.x}, ${pos.y}`);
      }
      square.hasBoat = true;
      square.boat = BoatPart.MIDDLE;
    });
  }
}
