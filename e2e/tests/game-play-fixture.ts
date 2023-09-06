import { test as base } from "@playwright/test";
import { deleteGameRoomByTitle, uniquefy } from "./common";
import { config } from "./config";
import { GamePlayPage } from "./game-play-page";
import { LobbyPage } from "./lobby-page";
import { GameState } from "./models";
import { GameRoomApi } from "./models/gameRoomApi";
import { UserApi } from "./models/userApi";

type GameFixture = {
  user1: UserApi;
  user2: UserApi;
  gameRoom: GameRoomApi;
  page1: GamePlayPage;
  page2: GamePlayPage;
  aiPage: GamePlayPage;
  seededPlacements: GamePlayPage;
  lobbyPage: LobbyPage;
  aiLobby: LobbyPage;
  aiGameTitle: string;
};

export const test = base.extend<GameFixture>({
  aiGameTitle: async ({ page }, use) => {
    const title = uniquefy("ai game");
    await use(title);
    await deleteGameRoomByTitle(page.request, title);
  },
  user1: async ({ page }, use) => {
    const user = new UserApi(page, "Player 1");
    await user.create();
    await use(user);
    await user.cleanup();
  },
  user2: async ({ browser }, use) => {
    const page = await browser.newPage();
    const user = new UserApi(page, "Player 2");
    await user.create();
    await use(user);
    await user.cleanup();
  },
  gameRoom: async ({ page }, use) => {
    const gameRoom = new GameRoomApi(page.request, "Test game");
    await gameRoom.create();
    await use(gameRoom);
    await gameRoom.cleanup();
  },
  page1: async ({ page, user1, user2, gameRoom }, use) => {
    const gamePlayPage = new GamePlayPage(page);

    await user1.signIn();
    await gameRoom.join();
    await gameRoom.addPlayer(user2.name);
    await page.goto(`${config.frontendUrl}/game/${gameRoom.id}`);

    await use(gamePlayPage);
  },
  page2: async ({ user2, gameRoom }, use) => {
    const gamePlayPage = new GamePlayPage(user2.page);

    await user2.signIn();
    await user2.page.goto(`${config.frontendUrl}/game/${gameRoom.id}`);

    await use(gamePlayPage);
  },
  aiLobby: async ({ page, user1 }, use) => {
    const lobbyPage = new LobbyPage(page);
    await user1.signIn();
    await lobbyPage.goToLobby();
    await use(lobbyPage);
  },
  aiPage: async ({ page }, use) => {
    const aiPage = new GamePlayPage(page);
    await use(aiPage);
  },
  lobbyPage: async ({ page2 }, use) => {
    const lobbyPage = new LobbyPage(page2.page);
    await use(lobbyPage);
  },
  seededPlacements: async ({ page1, user1, user2, gameRoom }, use) => {
    await page1.seedGameDummyShips(
      user1.name,
      user2.name,
      gameRoom.id,
      GameState.PLACEMENTS
    );
    await use(page1);
  },
});
