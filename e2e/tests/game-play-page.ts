import { expect, Page } from "@playwright/test";
import { leaveGame, seedGameShips, startGameRequest } from "./common";
import { GameSeed, GameState } from "./models";

export const STANDARD_SHIP_SQUARE_COUNT = 26;

export class GamePlayPage {
  async clickPrimarySquare(x: number, y: number) {
    const square = this.getPrimarySquare(x, y).getByTestId("ship-square");
    await square.click();
  }
  async verifyOwnShipInSquare(x: number, y: number) {
    const square = this.getPrimarySquare(x, y).getByTestId("ship-square");
    await expect(square).toBeVisible();
  }
  async verifyEnemyShipInSquare(x: number, y: number) {
    const square = this.getTrackingSquare(x, y).getByTestId("ship-square");
    await expect(square).toBeVisible();
  }
  async verifyEmptyEnemySquare(x: number, y: number) {
    const square = this.getTrackingSquare(x, y).getByTestId("water-square");
    await expect(square).toBeVisible();
  }
  async rotateShip() {
    await this.page.getByTestId("LoopIcon").click();
  }
  async moveShipDown() {
    await this.page.getByTestId("ArrowDropDownIcon").click();
  }

  readonly page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getStartButton = () => this.page.getByRole("button", { name: /start/i });
  getEndButton = () => this.page.getByRole("button", { name: /end/i });
  getConfirmButton = () => this.page.getByRole("button", { name: /confirm/i });
  getGameOverDialog = () => this.page.getByTestId("game-over-dialog");
  getTrackingSquare = (x: number, y: number) =>
    this.page.getByTestId("tracking-board").getByTestId(`square-${x}-${y}`);
  getPrimarySquare = (x: number, y: number) =>
    this.page.getByTestId("primary-board").getByTestId(`square-${x}-${y}`);

  startGame = async () => {
    await this.getStartButton().click();
  };

  endGame = async () => {
    await this.getEndButton().click();
  };

  async confirmPlacements() {
    await this.getConfirmButton().click();
  }

  leaveGame = async (gameRoomId: string) => {
    await leaveGame(this.page.request, { gameId: gameRoomId });
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

  verifyGameInPlacementsState = async () => {
    await expect(this.getConfirmButton()).toBeVisible();
  };

  verifyGameInStartedState = async () => {
    await expect(this.getStartButton()).toBeVisible();
  };

  verifyPlayerReady = async (name: string) => {
    await expect(
      this.page
        .getByTestId("player-info")
        .filter({ has: this.page.getByText(name) })
        .getByTestId("ready-icon")
    ).toBeVisible();
  };

  verifyGameVisible = async (gameName: string) => {
    const gameHeading = this.page.getByRole("heading", { name: gameName });
    await expect(gameHeading).toBeVisible();
  };

  verifyGameOver = async (winner: string) => {
    const gameOverDialog = this.getGameOverDialog();
    await expect(gameOverDialog).toBeVisible();
    await expect(gameOverDialog).toContainText(winner);
    await gameOverDialog.getByText(/close/i).click();
    await expect(this.getEndButton()).toBeDisabled();
  };

  verifyPlayerTurnActive = async (name: string) => {
    const classNames = await this.getPlayerClassNames(this.page, name);
    await expect(classNames).toContain("active");
  };

  verifyPlayerTurnInactive = async (name: string) => {
    const classNames = await this.getPlayerClassNames(this.page, name);
    await expect(classNames).not.toContain("active");
  };

  async verifyUserNotInGame(name: string) {
    const nameElement = this.page.getByTestId("player-name").getByText(name);
    await expect(nameElement).toBeHidden();
  }

  async verifyTwoPlayersErrorVisible() {
    await expect(this.page.getByText(/game requires 2 players/i)).toBeVisible();
  }

  private getPlayerClassNames = async (page: Page, name: string) => {
    return await page
      .getByTestId("active-game")
      .getByRole("heading", { name })
      .evaluate((el) => el.className);
  };

  seedGameDummyShips = async (
    player1: string,
    player2: string,
    gameRoomId: string,
    state: GameState
  ) => {
    const { request } = this.page;
    await startGameRequest(request, gameRoomId);
    const seed: GameSeed = {
      state,
      firstPlayerName: player1,
      gameRoomId: gameRoomId,
      shipPositions: [
        {
          playerId: player1,
          ships: [{ start: { x: 0, y: 0 }, isVertical: true, length: 2 }],
        },
        {
          playerId: player2,
          ships: [{ start: { x: 0, y: 0 }, isVertical: true, length: 2 }],
        },
      ],
    };
    await seedGameShips(request, seed);
  };
}
