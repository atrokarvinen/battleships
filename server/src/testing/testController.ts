import { Request, Response } from "express";
import { GameRoom } from "../database/gameRoom";
import { User } from "../database/user";
import { GameModel } from "../game/database/dbSchema";
import { Point } from "../game/models/point";
import { ShipPart } from "../game/models/shipPart";
import { Square } from "../game/models/square";
import { pointsEqual } from "../game/services/board-utils";
import { GameSeed } from "./models";

export class TestController {
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
    await GameModel.deleteMany({ gameRoomId: gameRoom?._id });
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

  setPositions(positions: Point[], ships: Square[]) {
    ships.forEach((s) => {
      s.hasShip = false;
      s.ship = ShipPart.UNKNOWN;
    });
    positions.forEach((pos) => {
      const square = ships.find((s) => pointsEqual(s.point, pos));
      if (!square) {
        throw new Error(`square not found at ${pos.x}, ${pos.y}`);
      }
      square.hasShip = true;
      square.ship = ShipPart.MIDDLE;
    });
  }
}
