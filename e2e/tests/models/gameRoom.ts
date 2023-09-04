import { APIRequestContext } from "@playwright/test";
import {
  addPlayerToGame,
  createGameRoom,
  deleteGameRoomByTitle,
  joinGame,
  uniquefy,
} from "../common";

export class GameRoom {
  request: APIRequestContext;
  name: string;
  id: string = "N/A";

  constructor(request: APIRequestContext, name: string) {
    this.request = request;
    this.name = uniquefy(name);
  }

  async create() {
    const response = await createGameRoom(this.request, { title: this.name });
    const createdGameRoom = await response.json();
    this.id = createdGameRoom.id;
  }

  async join() {
    await joinGame(this.request, { gameId: this.id });
  }

  async addPlayer(playerName: string) {
    await addPlayerToGame(this.request, {
      gameRoomId: this.id,
      playerName,
    });
  }

  async cleanup() {
    await deleteGameRoomByTitle(this.request, this.name);
  }
}
