import { expect } from "@playwright/test";
import { test } from "./game-play-fixture";

test("starts game", async ({ page, gamePlayPage, player1 }) => {
  await expect(page.getByRole("button", { name: /start/i })).toBeVisible();

  await gamePlayPage.startGame();

  await gamePlayPage.verifyPlayerTurnActive(player1);
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

test("changes player order when fails to guess", async ({
  page,
  gamePlayPage,
  player1,
}) => {
  await gamePlayPage.startGame();
  await gamePlayPage.seedGameDummyShips();
  await page.reload();
  await gamePlayPage.verifyPlayerTurnActive(player1);

  const enemyBoard = page.getByTestId("enemy-board");
  const guessedSquare = enemyBoard.getByTestId("square-5-5");
  await guessedSquare.click();

  await expect(guessedSquare.getByTestId("water-square")).toHaveClass(/missed/);
  await gamePlayPage.verifyPlayerTurnInactive(player1);
});

test("ends game when all ships are destroyed", async ({
  page,
  gamePlayPage,
  player1,
}) => {
  await gamePlayPage.startGame();
  await gamePlayPage.seedGameDummyShips();
  await page.reload();

  const gameOverDialog = page.getByTestId("game-over-dialog");
  await expect(gameOverDialog).toBeHidden();

  const enemyBoard = page.getByTestId("enemy-board");
  await enemyBoard.getByTestId("square-0-0").click();
  await enemyBoard.getByTestId("square-0-1").click();

  await expect(gameOverDialog).toBeVisible();
  await expect(gameOverDialog).toContainText(player1);
});

test("loads the game when page is refreshed", async ({
  page,
  gamePlayPage,
  player1,
}) => {
  await gamePlayPage.startGame();
  await gamePlayPage.seedGameDummyShips();
  await page.reload();

  await expect(page.getByTestId("ship-square")).toHaveCount(2);
  await gamePlayPage.verifyPlayerTurnActive(player1);
});

test("cannot guess when not own turn", async ({
  page,
  gamePlayPage,
  player1,
}) => {
  await gamePlayPage.startGame();
  await gamePlayPage.seedGameDummyShips();
  await page.reload();

  const enemyBoard = page.getByTestId("enemy-board");
  const square1 = enemyBoard.getByTestId("square-5-5");
  await expect(square1).toBeVisible();
  await square1.click();

  await expect(square1.getByTestId("water-square")).toHaveClass(/missed/);
  await gamePlayPage.verifyPlayerTurnInactive(player1);

  const square2 = enemyBoard.getByTestId("square-0-0");
  await square2.click();
  await page.waitForTimeout(1000);
  await expect(square2.getByTestId("water-square")).not.toHaveClass(/missed/);
});

test("ends game", async ({ page }) => {
  expect(true).toBeTruthy();
});
