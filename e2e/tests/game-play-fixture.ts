import { test as base } from "@playwright/test";
import { GamePlayPage } from "./game-play-page";

export const test = base.extend<{ gamePlayPage: GamePlayPage }>({
  gamePlayPage: async ({ page }, use) => {
    // Set up the fixture.
    const gamePlayPage = new GamePlayPage(page);
    await gamePlayPage.goto();

    // Use the fixture value in the test.
    await use(gamePlayPage);

    // Clean up the fixture.
    await gamePlayPage.removeAll();
  },
});
