import { expect, test } from "@playwright/test";
import { deleteAllUsers, signUp, signUpAndSignIn } from "./common";
import { config } from "./config";
import { User } from "./models";

const { frontendUrl } = config;

test.beforeEach(async ({ page }) => {
  await deleteAllUsers(page.request);
  await page.goto(frontendUrl);
});

test.afterEach(async ({ request }) => {
  await deleteAllUsers(request);
});

test("signs up", async ({ page }) => {
  const dialog = page.getByTestId("sign-up-dialog");
  expect(dialog).not.toBeVisible();
  await page.getByText(/sign up/i).click();
  await expect(dialog).toBeVisible();

  const usernameLocator = page.getByLabel(/username/i);
  await expect(dialog.locator(usernameLocator)).toBeVisible();
  await dialog.locator(page.getByLabel(/username/i)).fill("test username");

  const passwordLocator = page.locator("#sign-up-password");
  await expect(dialog.locator(passwordLocator)).toBeVisible();
  await dialog.locator(passwordLocator).fill("Password1");

  await page.getByLabel(/confirm password/i).fill("Password1");

  await page.getByText(/submit/i).click();
  await expect(dialog).not.toBeVisible();
});

test("signs in", async ({ page }) => {
  const username = "test username";
  const password = "Password1";
  const user: User = { username, password };
  await signUp({ req: page.request, user });

  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/password/i).fill(password);

  expect(page.url()).not.toContain("lobby");
  await page.getByRole("button", { name: "Login", exact: true }).click();
  const playerName = page.getByRole("heading", { name: username });
  await expect(playerName).toBeVisible();
  expect(page.url()).toContain("lobby");
});

test("does not sign in when wrong password", async ({ page }) => {
  const username = "test username";
  const password = "Password1";
  const user: User = { username, password };
  await signUp({ req: page.request, user });

  await page.getByLabel(/username/i).fill(username);
  await page.getByLabel(/password/i).fill("Invalid password");

  await expect(page.getByText(/invalid/i)).not.toBeVisible();
  await page.getByRole("button", { name: "Login", exact: true }).click();

  await expect(page.getByText(/invalid username or password/i)).toBeVisible();

  expect(page.url()).toContain("login");
});

test("requires unique username", async ({ page }) => {
  const username = "test username";
  const password = "Password1";
  const user: User = { username, password };
  await signUp({ req: page.request, user });

  const dialog = page.getByTestId("sign-up-dialog");
  await page.getByText(/sign up/i).click();
  await expect(dialog).toBeVisible();

  await dialog.locator(page.getByLabel(/username/i)).fill(username);
  await dialog.locator(page.locator("#sign-up-password")).fill("Password1");
  await page.getByLabel(/confirm password/i).fill("Password1");

  const errorText = new RegExp(/Username .* already exists/i);
  await expect(page.getByText(errorText)).not.toBeVisible();
  await page.getByText(/submit/i).click();
  await expect(page.getByText(errorText)).toBeVisible();
  await expect(dialog).toBeVisible();
});

test("stays logged in after page refresh", async ({ page }) => {
  const username = "test username";
  const password = "Password1";
  const user: User = { username, password };
  await signUpAndSignIn({ req: page.request, user });

  await page.goto(`${frontendUrl}/lobby`);
  const playerName = page.getByRole("heading", { name: username });
  await expect(playerName).toBeVisible();

  await page.reload();

  await expect(playerName).toBeVisible();
});

test("logs out when logout button is clicked", async ({ page }) => {
  const username = "test username";
  const password = "Password1";
  const user: User = { username, password };
  await signUpAndSignIn({ req: page.request, user });

  await page.goto(`${frontendUrl}/lobby`);
  await expect(page.getByRole("heading", { name: username })).toBeVisible();

  await page.getByRole("button", { name: /logout/i }).click();
  await expect(page.getByRole("button", { name: /sign up/i })).toBeVisible();
  await expect(page.url()).toContain("/login");
});

test("logs out when page is closed", async ({ page, browser }) => {
  const username = "test username";
  const password = "Password1";
  const user: User = { username, password };
  await signUpAndSignIn({ req: page.request, user });

  await page.goto(`${frontendUrl}/lobby`);
  const playerName = page.getByRole("heading", { name: username });
  await expect(playerName).toBeVisible();

  await page.close();

  const context = await browser.newContext();
  const newPage = await context.newPage();
  await newPage.goto(`${frontendUrl}/lobby`);
  await expect(newPage.getByText(/not authorized/i)).toBeVisible();
});
