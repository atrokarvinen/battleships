import { expect } from "@playwright/test";
import { signIn } from "./common";
import { defaultPassword } from "./defaults";
import { test } from "./game-play-fixture";
import { STANDARD_SHIP_SQUARE_COUNT } from "./game-play-page";

test("starts game", async ({ page, gamePlayPage }) => {
  await expect(page.getByRole("button", { name: /start/i })).toBeVisible();

  await gamePlayPage.startGame();

  await gamePlayPage.verifyGameHasStarted();
  await gamePlayPage.verifyPlayerTurnActive(gamePlayPage.player1);
});

test("cannot start game when game already started", async ({
  page,
  gamePlayPage,
}) => {
  const startButton = page.getByRole("button", { name: /start/i });
  await expect(startButton).toBeEnabled();
  await gamePlayPage.startGame();
  await expect(startButton).toBeDisabled();
});

test("cannot start game if player count is not two", async ({ page }) => {
  expect(true).toBeTruthy();
});

test("changes player order when fails to attack", async ({
  page,
  gamePlayPage,
}) => {
  await gamePlayPage.startGame();
  await gamePlayPage.verifyGameHasStarted();
  await gamePlayPage.seedGameDummyShips();
  await page.reload();
  await gamePlayPage.verifyPlayerTurnActive(gamePlayPage.player1);

  const trackingBoard = page.getByTestId("tracking-board");
  const attackedSquare = trackingBoard.getByTestId("square-5-5");
  await attackedSquare.click();

  await expect(attackedSquare.getByTestId("water-square")).toHaveClass(
    /missed/
  );
  await gamePlayPage.verifyPlayerTurnInactive(gamePlayPage.player1);
});

test("ends game when all ships are destroyed", async ({
  page,
  gamePlayPage,
}) => {
  await gamePlayPage.startGame();
  await gamePlayPage.verifyGameHasStarted();
  await gamePlayPage.seedGameDummyShips();
  await page.reload();

  const gameOverDialog = page.getByTestId("game-over-dialog");
  await expect(gameOverDialog).toBeHidden();

  const trackingBoard = page.getByTestId("tracking-board");
  await trackingBoard.getByTestId("square-0-0").click();
  await trackingBoard.getByTestId("square-0-1").click();

  await expect(gameOverDialog).toBeVisible();
  await expect(gameOverDialog).toContainText(gamePlayPage.player1);
});

test("loads the game when page is refreshed", async ({
  page,
  gamePlayPage,
}) => {
  await gamePlayPage.startGame();
  await gamePlayPage.verifyGameHasStarted();
  await gamePlayPage.seedGameDummyShips();
  await page.reload();

  await expect(page.getByTestId("ship-square")).toHaveCount(2);
  await gamePlayPage.verifyPlayerTurnActive(gamePlayPage.player1);
});

test("cannot attack when not own turn", async ({ page, gamePlayPage }) => {
  await gamePlayPage.startGame();
  await gamePlayPage.verifyGameHasStarted();
  await gamePlayPage.seedGameDummyShips();
  await page.reload();

  const trackingBoard = page.getByTestId("tracking-board");
  const square1 = trackingBoard.getByTestId("square-5-5");
  await expect(square1).toBeVisible();
  await square1.click();

  await expect(square1.getByTestId("water-square")).toHaveClass(/missed/);
  await gamePlayPage.verifyPlayerTurnInactive(gamePlayPage.player1);

  const square2 = trackingBoard.getByTestId("square-0-0");
  await square2.click();
  await page.waitForTimeout(1000);
  await expect(square2.getByTestId("water-square")).not.toHaveClass(/missed/);
});

test("attacks are broadcasted", async ({ page, gamePlayPage, browser }) => {
  const context = await browser.newContext();
  const pageP2 = await context.newPage();
  await signIn({
    req: pageP2.request,
    user: { username: gamePlayPage.player2, password: defaultPassword },
  });
  await pageP2.goto(page.url());
  await expect(pageP2.getByText("Battleships app")).toBeVisible();

  await gamePlayPage.startGame();
  await gamePlayPage.verifyGameHasStarted();
  await gamePlayPage.seedGameDummyShips();
  await page.reload();

  const trackingBoardP1 = page.getByTestId("tracking-board");
  const squareP1 = trackingBoardP1.getByTestId("square-5-5");
  await expect(squareP1).toBeVisible();
  await squareP1.click();

  const primaryBoardP2 = pageP2.getByTestId("primary-board");
  const squareP2 = primaryBoardP2.getByTestId("square-5-5");
  await expect(squareP2.getByTestId("water-square")).toHaveClass(/missed/);
  await expect(squareP1.getByTestId("water-square")).toHaveClass(/missed/);
});

test("game start is broadcasted", async ({ page, gamePlayPage, browser }) => {
  const context = await browser.newContext();
  const pageP2 = await context.newPage();
  await signIn({
    req: pageP2.request,
    user: { username: gamePlayPage.player1, password: defaultPassword },
  });
  await pageP2.goto(page.url());
  await expect(pageP2.getByText("Battleships app")).toBeVisible();

  await gamePlayPage.startGame();
  await expect(pageP2.getByTestId("ship-square")).toHaveCount(
    STANDARD_SHIP_SQUARE_COUNT
  );
});

test("ends game", async ({ page }) => {
  expect(true).toBeTruthy();
});
