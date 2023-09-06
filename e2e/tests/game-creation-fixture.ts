import { test as base } from "@playwright/test";
import { deleteGameRoomByTitle, uniquefy } from "./common";
import { LobbyPage } from "./lobby-page";
import { UserApi } from "./models/userApi";

type GameCreationFixture = {
  user1: UserApi;
  user2: UserApi;
  page1: LobbyPage;
  page2: LobbyPage;
  gameTitle: string;
  gameTitleNotDeleted: string;
};

export const test = base.extend<GameCreationFixture>({
  gameTitle: uniquefy("test game"),
  gameTitleNotDeleted: uniquefy("not deleted"),
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
  page1: async ({ page, user1, gameTitle, gameTitleNotDeleted }, use) => {
    const lobbyPage = new LobbyPage(page);
    await user1.signIn();
    await use(lobbyPage);
    await deleteGameRoomByTitle(page.request, gameTitle);
    await deleteGameRoomByTitle(page.request, gameTitleNotDeleted);
  },
  page2: async ({ user2 }, use) => {
    const lobbyPage = new LobbyPage(user2.page);
    await user2.signIn();
    await use(lobbyPage);
  },
});
