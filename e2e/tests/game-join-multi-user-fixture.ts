import { test as base } from "@playwright/test";
import { createGameRoom, signUpAndSignIn, uniquefy } from "./common";
import { config } from "./config";
import { defaultPassword } from "./defaults";
import { GameJoinPage } from "./game-join-page";

type GameJoinMultiUserFixture = {
  gameJoinPage: GameJoinPage;
  gameJoinPage2: GameJoinPage;
  title: string;
  username1: string;
  username2: string;
};

export const test = base.extend<GameJoinMultiUserFixture>({
  gameJoinPage: async ({ browser, title, username1 }, use) => {
    const user1 = { username: username1, password: defaultPassword };
    const context = await browser.newContext();
    const page = await context.newPage();
    const request = page.request;

    const gameJoinPage = new GameJoinPage(page);
    await gameJoinPage.cleanup([title], [username1]);
    await signUpAndSignIn({ req: request, user: user1 });
    await createGameRoom(request, { title });
    await page.goto(`${config.frontendUrl}/lobby`);

    await use(gameJoinPage);

    await gameJoinPage.cleanup([title], [username1]);
  },
  gameJoinPage2: async ({ browser, username2 }, use) => {
    const user2 = { username: username2, password: defaultPassword };
    const context = await browser.newContext();
    const page = await context.newPage();
    const request = page.request;

    const gameJoinPage = new GameJoinPage(page);
    await gameJoinPage.cleanup([], [username2]);
    await signUpAndSignIn({ req: request, user: user2 });
    await page.goto(`${config.frontendUrl}/lobby`);

    await use(gameJoinPage);

    await gameJoinPage.cleanup([], [username2]);
  },
  title: uniquefy("test game join"),
  username1: uniquefy("Player 1"),
  username2: uniquefy("Player 2"),
});
