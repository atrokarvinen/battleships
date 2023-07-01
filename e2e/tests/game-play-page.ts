import {
  APIRequestContext,
  BrowserContext,
  expect,
  Locator,
  Page,
} from "@playwright/test";
import { joinGame, seedGameShips, signUpAndSignIn } from "./common";
import { config } from "./config";
import { defaultPassword } from "./defaults";
import { GameSeed } from "./models";

export class GamePlayPage {
  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  startGame = async (page: Page) => {
    await expect(page.getByTestId("ship-square")).toBeHidden();
    await page.getByRole("button", { name: /start/i }).click();
    await expect(page.getByTestId("ship-square")).toHaveCount(2);
  };

  addPlayer2ToGame = async (context: BrowserContext) => {
    const pageP2 = await context.newPage();
    await signUpAndSignIn({
      req: pageP2.request,
      user: { username: player2, password: defaultPassword },
    });
    await joinGame(pageP2.request, { gameId: gameRoomId });
  };

  verifyPlayerTurnActive = async (page: Page, name: string) => {
    const classNames = await this.getPlayerClassNames(page, name);
    await expect(classNames).toContain("active");
  };

  verifyPlayerTurnInactive = async (page: Page, name: string) => {
    const classNames = await this.getPlayerClassNames(page, name);
    await expect(classNames).not.toContain("active");
  };

  private getPlayerClassNames = async (page: Page, name: string) => {
    return await page
      .getByTestId("active-game")
      .getByRole("heading", { name })
      .evaluate((el) => el.className);
  };

  seedGameDummyShips = async (request: APIRequestContext) => {
    const seed: GameSeed = {
      gameRoomId: gameRoomId,
      shipPositions: [
        {
          playerId: player1,
          shipPoints: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
          ],
        },
        {
          playerId: player2,
          shipPoints: [
            { x: 0, y: 0 },
            { x: 0, y: 1 },
          ],
        },
      ],
    };
    await seedGameShips(request, seed);
  };

  async goto() {
    await this.page.goto(`${config.frontendUrl}/game/${gameRoomId}`);
  }
}

export class PlaywrightDevPage {
  readonly page: Page;
  readonly getStartedLink: Locator;
  readonly gettingStartedHeader: Locator;
  readonly pomLink: Locator;
  readonly tocList: Locator;

  constructor(page: Page) {
    this.page = page;
    this.getStartedLink = page.locator("a", { hasText: "Get started" });
    this.gettingStartedHeader = page.locator("h1", { hasText: "Installation" });
    this.pomLink = page
      .locator("li", { hasText: "Guides" })
      .locator("a", { hasText: "Page Object Model" });
    this.tocList = page.locator("article div.markdown ul > li > a");
  }

  async goto() {
    await this.page.goto("https://playwright.dev");
  }

  async getStarted() {
    await this.getStartedLink.first().click();
    await expect(this.gettingStartedHeader).toBeVisible();
  }

  async pageObjectModel() {
    await this.getStarted();
    await this.pomLink.click();
  }
}
