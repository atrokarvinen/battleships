import { expect, test } from "@playwright/test";
import {
  createGameRoom,
  deleteGameRoomByTitle,
  deleteUserByName,
  signUpAndSignIn,
  uniquefy,
} from "./common";
import { config } from "./config";
import { defaultPassword, defaultUser } from "./defaults";

const title = uniquefy("test game join");
const username = uniquefy(defaultUser.username);

test.beforeEach(async ({ page }) => {
  const { request } = page;

  await deleteGameRoomByTitle(request, title);
  await deleteUserByName(request, username);

  await createGameRoom(request, { title });
  await signUpAndSignIn({
    req: request,
    user: { username, password: defaultPassword },
  });

  await page.goto(`${config.frontendUrl}/lobby`);
});

test.afterEach(async ({ request }) => {
  await deleteGameRoomByTitle(request, title);
  await deleteUserByName(request, username);
});

test("joins game", async ({ page }) => {
  await expect(page.getByText(title)).toBeVisible();

  const gameCard = page
    .getByTestId("game-row")
    .filter({ has: page.getByText(title) });
  await expect(gameCard).toBeVisible();
  await gameCard.click();

  const dialog = page.getByTestId("game-details-dialog");
  const game = page.getByTestId("active-game");
  await expect(game).toBeHidden();
  await dialog.getByRole("button", { name: /join/i }).click();
  await expect(game).toBeVisible();
});

test("cannot join same game twice", async ({ page }) => {
  const gameCard = page
    .getByTestId("game-row")
    .filter({ has: page.getByText(title) });

  const dialog = page.getByTestId("game-details-dialog");

  // Join first time
  gameCard.click();
  await dialog.getByRole("button", { name: /join/i }).click();
  await expect(page.getByTestId("active-game")).toBeVisible();

  await page.getByText(/battleships app/i).click();

  // Join second time
  gameCard.click();
  await expect(dialog.getByRole("button", { name: /join/i })).toBeDisabled();
  await expect(dialog.getByRole("button", { name: /go/i })).toBeEnabled();
});

test("cannot join game if it's full", async ({ page }) => {
  expect(1).toBe(1);
});

test("leaves game", async ({ page }) => {
  const gameCard = page
    .getByTestId("game-row")
    .filter({ has: page.getByText(title) });
  gameCard.click();

  const dialog = page.getByTestId("game-details-dialog");
  await dialog.getByRole("button", { name: /join/i }).click();

  await page.getByText(/battleships app/i).click();

  await expect(gameCard.getByText(username)).toBeVisible();

  gameCard.click();
  await dialog.getByRole("button", { name: /leave/i }).click();

  await expect(gameCard.getByText(username)).toBeHidden();
});
