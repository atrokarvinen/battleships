import { APIRequestContext, expect, test } from "@playwright/test";
import {
  createGameRoom as createGameRequest,
  deleteGameRoomByTitle,
  deleteUserByName,
  signUpAndSignIn,
  uniquefy,
} from "./common";
import { config } from "./config";
import { defaultUser } from "./defaults";

const { frontendUrl } = config;

test.describe("multi user game creation", () => {
  const username1 = uniquefy("test1");
  const username2 = uniquefy("test2");
  const gameTitle = uniquefy("test game");

  test.beforeEach(async ({ request }) => {
    await cleanup(request);
  });

  test.afterEach(async ({ request }) => {
    await cleanup(request);
  });

  const cleanup = async (request: APIRequestContext) => {
    await deleteGameRoomByTitle(request, gameTitle);
    await deleteUserByName(request, username1);
    await deleteUserByName(request, username2);
  };

  test("broadcasts game creation to other users", async ({ context }) => {
    const page1 = await context.newPage();
    const page2 = await context.newPage();
    const user1 = { username: username1, password: defaultUser.password };
    const user2 = { username: username2, password: defaultUser.password };
    await signUpAndSignIn({ req: page1.request, user: user1 });
    await signUpAndSignIn({ req: page2.request, user: user2 });

    await page1.goto(`${frontendUrl}/lobby`);
    await page2.goto(`${frontendUrl}/lobby`);

    await createGameRequest(page1.request, { title: gameTitle });

    const createdGame = page1
      .getByTestId("game-row")
      .filter({ hasText: gameTitle });
    await expect(createdGame).toBeVisible();
    const createdGameOtherUser = page2
      .getByTestId("game-row")
      .filter({ hasText: gameTitle });
    await expect(createdGameOtherUser).toBeVisible();
  });
});
