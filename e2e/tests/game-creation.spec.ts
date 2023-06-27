import { test, expect, Page } from "@playwright/test";
import { deleteAllGames, deleteAllUsers, signUpAndSignIn } from "./common";
import { config } from "./config";

const { frontendUrl } = config;

test.beforeEach(async ({ page }) => {
  await deleteAllUsers(page.request);
  await deleteAllGames(page.request);
  signUpAndSignIn({ req: page.request });
  await page.goto(`${frontendUrl}/lobby`);
});

test.afterEach(async ({ request }) => {
  await deleteAllGames(request);
});

test("creates game", async ({ page }) => {
  const gameTitle = "test game";

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
  const gameTitle = "test game";
  await createGame(gameTitle, page);

  await page.reload();

  await expect(page.getByText(gameTitle)).toBeVisible();
});

test("cancel closes dialog and does not create game", async ({ page }) => {
  const gameTitle = "test game";

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
  const gameTitle = "test game";

  await createGame(gameTitle, page);
  await createGame("not deleted", page);

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
  await expect(page.getByText("not deleted")).toBeVisible();
});

const createGame = async (title: string, page: Page) => {
  await page.getByRole("button", { name: /create new game/i }).click();
  await page.getByLabel(/title/i).fill(title);
  await page.getByRole("button", { name: /submit/i }).click();
};
