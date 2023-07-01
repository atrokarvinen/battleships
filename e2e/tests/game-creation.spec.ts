import { APIRequestContext, Page, expect, test } from "@playwright/test";
import {
  deleteGameRoomByTitle,
  deleteUserByName,
  signUpAndSignIn,
  uniquefy,
} from "./common";
import { config } from "./config";
import { defaultPassword, defaultUser } from "./defaults";

const { frontendUrl } = config;

const gameTitle = uniquefy("test game");
const gameTitleNotDeleted = uniquefy("not deleted");
const username = uniquefy(defaultUser.username);

test.beforeEach(async ({ page }) => {
  await cleanup(page.request);
  signUpAndSignIn({
    req: page.request,
    user: { username, password: defaultPassword },
  });
  await page.goto(`${frontendUrl}/lobby`);
});

test.afterEach(async ({ request }) => {
  await cleanup(request);
});

const cleanup = async (request: APIRequestContext) => {
  await deleteGameRoomByTitle(request, gameTitle);
  await deleteGameRoomByTitle(request, gameTitleNotDeleted);
  await deleteUserByName(request, username);
};

test("creates game", async ({ page }) => {
  const dialog = page.getByTestId("create-game-dialog");
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: /create new game/i }).click();
  await expect(dialog).toBeVisible();

  await page.getByLabel(/title/i).fill(gameTitle);
  await page.getByRole("button", { name: /submit/i }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText(gameTitle)).toBeVisible();
});

test("loads games after page reload", async ({ page }) => {
  await createGame(gameTitle, page);

  await page.reload();

  await expect(page.getByText(gameTitle)).toBeVisible();
});

test("cancel closes dialog and does not create game", async ({ page }) => {
  const dialog = page.getByTestId("create-game-dialog");
  await expect(dialog).toBeHidden();
  await page.getByRole("button", { name: /create new game/i }).click();
  await expect(dialog).toBeVisible();

  await page.getByLabel(/title/i).fill(gameTitle);
  await page.getByRole("button", { name: /cancel/i }).click();

  await expect(dialog).toBeHidden();
  await expect(page.getByText(gameTitle)).toBeHidden();
});

test("deletes game", async ({ page }) => {
  await createGame(gameTitle, page);
  await createGame(gameTitleNotDeleted, page);

  const createdGame = page
    .getByTestId("game-row")
    .filter({ hasText: gameTitle });
  await expect(createdGame).toBeVisible();
  await createdGame.click();

  const dialog = page.getByTestId("game-details-dialog");
  await expect(dialog).toBeVisible();

  await dialog.getByRole("button", { name: /delete/i }).click();
  await expect(dialog).toBeHidden();
  await expect(createdGame).toBeHidden();
  await expect(page.getByText(gameTitleNotDeleted)).toBeVisible();
});

const createGame = async (title: string, page: Page) => {
  await page.getByRole("button", { name: /create new game/i }).click();
  await page.getByLabel(/title/i).fill(title);
  await page.getByRole("button", { name: /submit/i }).click();
};
