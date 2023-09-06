// import { APIRequestContext, Page, expect, test } from "@playwright/test";
import { expect } from "@playwright/test";
import { test } from "./game-creation-fixture";

// const { frontendUrl } = config;

// const gameTitle = uniquefy("test game");
// const gameTitleNotDeleted = uniquefy("not deleted");
// const username = uniquefy(defaultUser.username);

test.beforeEach(async ({ page1 }) => {
  // await cleanup(page.request);
  // signUpAndSignIn({
  //   req: page.request,
  //   user: { username, password: defaultPassword },
  // });
  await page1.goToLobby();
  // await page.waitForURL(`${frontendUrl}/lobby`);
});

// test.afterEach(async ({ request }) => {
//   await cleanup(request);
// });

// const cleanup = async (request: APIRequestContext) => {
//   await deleteGameRoomByTitle(request, gameTitle);
//   await deleteGameRoomByTitle(request, gameTitleNotDeleted);
//   await deleteUserByName(request, username);
// };

test("creates game", async ({ page1, gameTitle }) => {
  const page = page1.page;
  await page1.createGameRoom(gameTitle);
  await expect(page.getByText(gameTitle)).toBeVisible();
});

test("loads games after page reload", async ({ page1, gameTitle }) => {
  await page1.createGameRoom(gameTitle);

  await page1.page.reload();

  await expect(page1.page.getByText(gameTitle)).toBeVisible();
});

test("cancel closes dialog and does not create game", async ({
  page1,
  gameTitle,
}) => {
  const page = page1.page;
  const dialog = page.getByTestId("create-game-dialog");
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: /create new game/i }).click();
  await expect(dialog).toBeVisible();

  await page.getByLabel(/title/i).fill(gameTitle);
  await page.getByRole("button", { name: /cancel/i }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText(gameTitle)).toBeHidden();
});

test("deletes game", async ({ page1, gameTitle, gameTitleNotDeleted }) => {
  await page1.createGameRoom(gameTitle);
  await page1.createGameRoom(gameTitleNotDeleted);

  const createdGame = page1.page
    .getByTestId("game-row")
    .filter({ hasText: gameTitle });
  await expect(createdGame).toBeVisible();
  await createdGame.click();

  const dialog = page1.page.getByTestId("game-details-dialog");
  await expect(dialog).toBeVisible();

  await dialog.getByRole("button", { name: /delete/i }).click();
  await expect(dialog).toBeHidden();
  await expect(createdGame).toBeHidden();
  await expect(page1.page.getByText(gameTitleNotDeleted)).toBeVisible();
});

test("broadcasts game creation to other users", async ({
  page1,
  page2,
  gameTitle,
}) => {
  await page2.goToLobby();
  await page1.createGameRoom(gameTitle);

  await page1.verifyGameRoomVisible(gameTitle);
  await page2.verifyGameRoomVisible(gameTitle);
});
