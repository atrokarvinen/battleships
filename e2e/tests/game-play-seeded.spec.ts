import { expect } from "@playwright/test";
import { test } from "./game-play-seeded-fixture";

test("loads game after page refresh", async ({ seededPage: page1, user1 }) => {
  const page = page1.page;
  await page.reload();
  await expect(page.getByTestId("ship-square")).toHaveCount(2);
  await page1.verifyPlayerTurnActive(user1.name);
});

test("ends turn when attack misses", async ({ seededPage: page1, user1 }) => {
  await page1.verifyPlayerTurnActive(user1.name);

  await page1.attackSquare(5, 5, false);

  await page1.verifyPlayerTurnInactive(user1.name);
});

test("ends game after all ships sunk", async ({ seededPage: page1, user1 }) => {
  const gameOverDialog = page1.getGameOverDialog();
  await expect(gameOverDialog).toBeHidden();

  await page1.attackSquare(0, 0, true);
  await page1.attackSquare(0, 1, true);

  await expect(gameOverDialog).toBeVisible();
  await expect(gameOverDialog).toContainText(user1.name);
});

test("can only attack on own turn", async ({ seededPage: page1, user1 }) => {
  await page1.attackSquare(5, 5, false);
  await page1.verifyPlayerTurnInactive(user1.name);

  const square2 = page1.getTrackingSquare(5, 6);
  await square2.click();
  await page1.page.waitForTimeout(1000);
  await expect(square2.getByTestId("water-square")).not.toHaveClass(/missed/);
});

test("attacks are broadcasted", async ({ seededPage: page1, page2, user2 }) => {
  await page1.attackSquare(5, 5, false);

  await page2.verifyPlayerTurnActive(user2.name);
  const primaryBoardP2 = page2.page.getByTestId("primary-board");
  const squareP2 = primaryBoardP2.getByTestId("square-5-5");
  await expect(squareP2.getByTestId("water-square")).toHaveClass(/missed/);
});
