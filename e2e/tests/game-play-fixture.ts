import { test as base } from "@playwright/test";
import { signIn } from "./common";
import { config } from "./config";
import { defaultPassword } from "./defaults";
import { GamePlayPage } from "./game-play-page";
import { LobbyPage } from "./lobby-page";
import { GameRoom } from "./models/gameRoom";
import { User } from "./models/user";

type GameFixture = {
  user1: User;
  user2: User;
  gameRoom: GameRoom;
  page1: GamePlayPage;
  page2: GamePlayPage;
  lobbyPage: LobbyPage;
};

export const test = base.extend<GameFixture>({
  user1: async ({ page }, use) => {
    const user = new User(page.request, "Player 1");
    await user.create();
    await use(user);
    await user.cleanup();
  },
  user2: async ({ page }, use) => {
    const user = new User(page.request, "Player 2");
    await user.create();
    await use(user);
    await user.cleanup();
  },
  gameRoom: async ({ page }, use) => {
    const gameRoom = new GameRoom(page.request, "Test game");
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
  page2: async ({ user2, gameRoom, browser }, use) => {
    const page = await browser.newPage();
    const gamePlayPage = new GamePlayPage(page);

    const user = { username: user2.name, password: defaultPassword };
    await signIn({ req: page.request, user });
    await page.goto(`${config.frontendUrl}/game/${gameRoom.id}`);

    await use(gamePlayPage);
  },
  lobbyPage: async ({ page2 }, use) => {
    const lobbyPage = new LobbyPage(page2.page);
    await use(lobbyPage);
  },
});
