import { test as base } from "./game-play-fixture";
import { GamePlayPage } from "./game-play-page";

type GameFixture = {
  seededPage: GamePlayPage;
};

export const test = base.extend<GameFixture>({
  seededPage: async ({ page1, user1, user2, gameRoom }, use) => {
    await page1.startGame();
    await page1.verifyGameHasStarted();
    await page1.seedGameDummyShips(user1.name, user2.name, gameRoom.id);
    await page1.page.reload();
    await use(page1);
  },
});
