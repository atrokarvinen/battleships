import { test as base } from "@playwright/test";
import {
  deleteGameRoomByTitle,
  uniquefy
} from "./common";
import { LobbyPage } from "./lobby-page";
import { GameRoomApi } from "./models/gameRoomApi";
import { UserApi } from "./models/userApi";

type GameJoinFixture = {
  user1: UserApi;
  user2: UserApi;
  page1: LobbyPage;
  page2: LobbyPage;
  title: string;
  gameRoom: GameRoomApi;
};

export const test = base.extend<GameJoinFixture>({
  title: async ({ page }, use) => {
    const title = uniquefy("test game join");
    await use(title);
    await deleteGameRoomByTitle(page.request, title);
  },
  user1: async ({ page }, use) => {
    const user = new UserApi(page, "User 1");
    await user.create();
    await use(user);
    await user.cleanup();
  },
  user2: async ({ browser }, use) => {
    const page = await browser.newPage();
    const user = new UserApi(page, "User 2");
    await user.create();
    await use(user);
    await user.cleanup();
  },
  gameRoom: async ({ page, user1 }, use) => {
    await user1.signIn();
    const gameRoom = new GameRoomApi(page.request, "test game join");
    await gameRoom.create();
    await use(gameRoom);
    await gameRoom.cleanup();
  },
  page1: async ({ page, user1 }, use) => {
    const lobbyPage = new LobbyPage(page);
    await user1.signIn();
    await use(lobbyPage);
  },
  page2: async ({ user2 }, use) => {
    const lobbyPage = new LobbyPage(user2.page);
    await user2.signIn();
    await use(lobbyPage);
  },
});
