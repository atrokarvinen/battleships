import { expect } from "@playwright/test";
import { test } from "./game-play-fixture";

test("cannot start game when game already started", async ({
  page1,
  page2,
}) => {
  await page1.startGame();

  await page1.confirmPlacements();
  await page2.confirmPlacements();

  await expect(page1.getStartButton()).toBeDisabled();
});

test("cannot start game if player count is not two", async ({
  page1,
  user2,
  gameRoom,
  lobbyPage,
}) => {
  await lobbyPage.leaveGameRoom(gameRoom.name);
  await lobbyPage.verifyUserNotInGameRoom(gameRoom.name, user2.name);
  await page1.verifyUserNotInGame(user2.name);

  await page1.startGame();
  await page1.verifyTwoPlayersErrorVisible();
});

test("ends game", async ({ page1, page2, user2 }) => {
  await page1.startGame();
  await page1.endGame();

  const winner = user2.name;
  await page1.verifyGameOver(winner);
  await page2.verifyGameOver(winner);
});
