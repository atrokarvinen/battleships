import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { Server } from "socket.io";
import { GameRoom } from "../database/gameRoom";
import { User } from "../database/user";
import { GameModel } from "../game/database/dbSchema";
import { GameDTO } from "../game/models";
import { Point } from "../game/models/point";
import { ShipPart } from "../game/models/shipPart";
import { Square } from "../game/models/square";
import { pointsEqual } from "../game/services/board-utils";
import { GameSeed } from "./models";

export class TestController {
  private io: Server;

  constructor(io: Server) {
    this.io = io;
  }

  deleteUserByName = async (req: Request, res: Response) => {
    const username = req.params.name;
    await User.deleteMany({ username });
    res.end();
  };

  deleteGameRoomByTitle = async (req: Request, res: Response) => {
    const title = req.params.title;
    const deletedGameRoom = await GameRoom.findOneAndDelete({ title });
    if (deletedGameRoom) {
      this.io.emit("gameDeleted", deletedGameRoom.id);
    }
    res.end();
  };

  deleteGamesFromGameRoom = async (req: Request, res: Response) => {
    const title = req.params.title;
    const gameRoom = await GameRoom.findOne({ title });
    const gameRoomId = new Types.ObjectId(gameRoom?._id);
    await GameModel.deleteMany({ gameRoom: gameRoomId });
    res.end();
  };

  seedGame = async (req: Request, res: Response) => {
    const seed: GameSeed = req.body;
    const { gameRoomId, shipPositions, firstPlayerName } = seed;
    const gameRoom = new Types.ObjectId(gameRoomId);
    const game = await GameModel.findOne({ gameRoom });
    if (!game) {
      return res.status(404).json({ error: `game '${gameRoomId}' not found` });
    }
    if (shipPositions.length !== 2) {
      return res.status(400).json({ error: "Must have exactly two players" });
    }

    const positions1 = shipPositions[0].shipPoints;
    const positions2 = shipPositions[1].shipPoints;
    const playerName1 = shipPositions[0].playerId;
    const playerName2 = shipPositions[1].playerId;
    const player1 = await User.findOne({ username: playerName1 });
    const player2 = await User.findOne({ username: playerName2 });
    const firstPlayer = await User.findOne({ username: firstPlayerName });
    const p1 = game.players.find((p) => p.playerId === player1?.id?.toString());
    const p2 = game.players.find((p) => p.playerId === player2?.id?.toString());
    if (!p1 || !p2 || !firstPlayer) {
      return res.status(404).json({ error: "player 1 or player 2 not found" });
    }

    this.setPositions(positions1, p1.ownShips);
    this.setPositions(positions2, p2.ownShips);
    game.activePlayerId = firstPlayer.id.toString();

    const updatedGame = await game.save();
    const gameDto: GameDTO = updatedGame.toObject();

    return res.end();
  };

  async getShips(req: Request, res: Response, next: NextFunction) {
    try {
      const { gameId, opponentId } = req.params;
      const game = await GameModel.findById(gameId);
      if (!game) {
        return res.status(404).json({ error: "game not found" });
      }
      const opponent = game.players.find(
        (p) => p.playerId.toString() === opponentId
      );
      if (!opponent) {
        return res.status(404).json({ error: "opponent not found" });
      }
      const ships = opponent.ownShips;
      return res.json(ships);
    } catch (error) {
      next(error);
    }
  }

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
