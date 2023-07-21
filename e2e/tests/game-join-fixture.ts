import { test as base } from "@playwright/test";
import { createGameRoom, signUpAndSignIn, uniquefy } from "./common";
import { config } from "./config";
import { defaultPassword, defaultUser } from "./defaults";
import { GameJoinPage } from "./game-join-page";

type GameJoinFixture = {
  gameJoinPage: GameJoinPage;
  title: string;
  username: string;
};

export const test = base.extend<GameJoinFixture>({
  gameJoinPage: async ({ page, title, username }, use) => {
    const user = { username, password: defaultPassword };
    const request = page.request;

    const gameJoinPage = new GameJoinPage(page);
    await gameJoinPage.cleanup([title], [username]);
    await signUpAndSignIn({ req: request, user });
    await createGameRoom(request, { title });
    await page.goto(`${config.frontendUrl}/lobby`);

    await use(gameJoinPage);

    await gameJoinPage.cleanup([title], [username]);
  },
  title: uniquefy("test game join"),
  username: uniquefy(defaultUser.username),
});
