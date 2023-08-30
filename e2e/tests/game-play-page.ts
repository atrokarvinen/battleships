import { BrowserContext, expect, Page } from "@playwright/test";
import {
  deleteGameRoomByTitle,
  deleteGamesFromGameRoom,
  deleteUserByName,
  joinGame,
  seedGameShips,
  signUpAndSignIn,
} from "./common";
import { defaultPassword } from "./defaults";
import { GameSeed } from "./models";

export const STANDARD_SHIP_SQUARE_COUNT = 26;

export class GamePlayPage {
  readonly page: Page;
  readonly context: BrowserContext;
  readonly player1: string;
  readonly player2: string;
  private gameRoomId: string = "";

  constructor(
    page: Page,
    context: BrowserContext,
    player1: string,
    player2: string
  ) {
    this.page = page;
    this.context = context;
    this.player1 = player1;
    this.player2 = player2;
  }

  setGameRoomId = (gameRoomId: string) => {
    this.gameRoomId = gameRoomId;
  };

  cleanup = async (gameName: string, p1: string, p2: string) => {
    const { request } = this.page;
    await deleteUserByName(request, p1);
    await deleteUserByName(request, p2);
    await deleteGamesFromGameRoom(request, gameName);
    await deleteGameRoomByTitle(request, gameName);
  };

  startGame = async () => {
    await expect(this.page.getByTestId("ship-square")).toBeHidden();
    await this.page.getByRole("button", { name: /start/i }).click();
  };

  verifyGameHasStarted = async () => {
    await expect(this.page.getByTestId("ship-square")).toHaveCount(
      STANDARD_SHIP_SQUARE_COUNT
    );
  };

  async attackSquare(x: number, y: number, expectShip: boolean) {
    const trackingBoard = this.page.getByTestId("tracking-board");
    const attackedSquare = trackingBoard.getByTestId(`square-${x}-${y}`);
    await attackedSquare.click();
    if (expectShip) {
      await expect(attackedSquare.getByTestId("ship-square")).toBeVisible();
    } else {
      await expect(attackedSquare.getByTestId("water-square")).toHaveClass(
        /missed/
      );
    }
  }

  addPlayerToGame = async (username: string, gameRoomId: string) => {
    const pageP2 = await this.context.newPage();
    await signUpAndSignIn({
      req: pageP2.request,
      user: { username, password: defaultPassword },
    });
    await joinGame(pageP2.request, { gameId: gameRoomId });
  };

  verifyPlayerTurnActive = async (name: string) => {
    const classNames = await this.getPlayerClassNames(this.page, name);
    await expect(classNames).toContain("active");
  };

  verifyPlayerTurnInactive = async (name: string) => {
    const classNames = await this.getPlayerClassNames(this.page, name);
    await expect(classNames).not.toContain("active");
  };

  private getPlayerClassNames = async (page: Page, name: string) => {
    return await page
      .getByTestId("active-game")
      .getByRole("heading", { name })
      .evaluate((el) => el.className);
  };

  seedGameDummyShips = async () => {
    const { request } = this.page;
    const seed: GameSeed = {
      firstPlayerName: this.player1,
      gameRoomId: this.gameRoomId,
      shipPositions: [
        {
          playerId: this.player1,
          ships: [{ start: { x: 0, y: 0 }, isVertical: true, length: 2 }],
        },
        {
          playerId: this.player2,
          ships: [{ start: { x: 0, y: 0 }, isVertical: true, length: 2 }],
        },
      ],
    };
    await seedGameShips(request, seed);
  };
}
