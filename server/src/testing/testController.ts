import { NextFunction, Request, Response } from "express";
import { Types } from "mongoose";
import { Server } from "socket.io";
import { GameRoom } from "../database/gameRoom";
import { User } from "../database/user";
import { GameModel } from "../game/database/dbSchema";
import { GameDTO, GameState } from "../game/models";
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

  addPlayerToGame = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { gameRoomId, playerName } = req.body;
      const gameRoom = await GameRoom.findById(gameRoomId);
      if (!gameRoom)
        return res.status(404).json({ error: "Game room not found" });
      const player = await User.findOne({ username: playerName });
      if (!player) return res.status(404).json({ error: "User not found" });
      gameRoom.players.push(player.id);
      await gameRoom.save();
      res.end();
    } catch (error) {
      next(error);
    }
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

    const ships1 = shipPositions[0].ships;
    const ships2 = shipPositions[1].ships;
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

    p1.ownShips = ships1;
    p2.ownShips = ships2;
    game.state = GameState.STARTED;
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
}
