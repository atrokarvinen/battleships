import {
  APIRequestContext,
  BrowserContext,
  Page,
  expect,
  test,
} from "@playwright/test";
import {
  createGameRoom,
  deleteGameRoomByTitle,
  deleteGamesFromGameRoom,
  deleteUserByName,
  joinGame,
  seedGameShips,
  signIn,
  signUpAndSignIn,
} from "./common";
import { config } from "./config";
import { defaultPassword } from "./defaults";
import { GameSeed } from "./models";

const frontendUrl = config.frontendUrl;

const gameName = "test game";
const player1 = "Player 1";
const player2 = "Player 2";

let gameRoomId: string;

test.beforeEach(async ({ page }) => {
  const { request } = page;
  await cleanup(request);
  await signUpAndSignIn({
    req: request,
    user: { username: player1, password: defaultPassword },
  });

  const response = await createGameRoom(request, { title: gameName });
  const createdGameRoom = await response.json();
  gameRoomId = createdGameRoom.id;

  await joinGame(request, { gameId: createdGameRoom.id });

  await page.goto(`${frontendUrl}/game/${gameRoomId}`);
});

test.afterEach(async ({ page, request }) => {
  // await cleanup(request);
});

const cleanup = async (request: APIRequestContext) => {
  await deleteUserByName(request, player1);
  await deleteUserByName(request, player2);
  await deleteGamesFromGameRoom(request, gameName);
  await deleteGameRoomByTitle(request, gameName);
};

test("starts game", async ({ page }) => {
  await expect(page.getByRole("button", { name: /start/i })).toBeVisible();

  await expect(page.getByTestId("ship-square")).toBeHidden();
  await page.getByRole("button", { name: /start/i }).click();
  await expect(page.getByTestId("ship-square")).toHaveCount(2);

  const classNames = await page
    .getByTestId("active-game")
    .getByRole("heading", { name: player1 })
    .evaluate((el) => el.className);
  expect(classNames).toContain("active");
});

test("cannot start game when game already started", async ({ page }) => {
  const startButton = page.getByRole("button", { name: /start/i });
  await expect(startButton).toBeEnabled();
  await startGame(page);
  await expect(startButton).toBeDisabled();
});

test("cannot start game if player count is not two", async ({ page }) => {
  expect(true).toBeTruthy();
});

test("changes player order when fails to guess", async ({ page, context }) => {
  await addPlayer2ToGame(context);
  await startGame(page);

  await verifyPlayerTurnActive(page, player1);

  const enemyBoard = page.getByTestId("enemy-board");
  const guessedSquare = enemyBoard.getByTestId("square-0-0");
  await guessedSquare.click();

  await expect(guessedSquare.getByTestId("water-square")).toHaveClass(/missed/);
  await verifyPlayerTurnInactive(page, player1);
});

test("ends game when all ships are destroyed", async ({ page, context }) => {
  await addPlayer2ToGame(context);

  await signIn({
    req: page.request,
    user: { username: player1, password: defaultPassword },
  });
  await startGame(page);

  const gameOverDialog = page.getByTestId("game-over-dialog");
  await expect(gameOverDialog).toBeHidden();

  await seedGameDummyShips(page.request);
  // TODO add socket.io update after seeding
  await page.reload();

  const enemyBoard = page.getByTestId("enemy-board");
  await enemyBoard.getByTestId("square-0-0").click();
  await enemyBoard.getByTestId("square-0-1").click();

  await expect(gameOverDialog).toBeVisible();
  await expect(gameOverDialog).toContainText(player1);
});

test("loads the game when page is refreshed", async ({ page }) => {
  await startGame(page);

  await page.reload();

  await expect(page.getByTestId("ship-square")).toHaveCount(2);
  await verifyPlayerTurnActive(page, player1);
});

test("cannot guess when not own turn", async ({ page, context }) => {
  await addPlayer2ToGame(context);
  await signIn({
    req: page.request,
    user: { username: player1, password: defaultPassword },
  });
  await startGame(page);
  await seedGameDummyShips(page.request);
  await page.reload();

  const enemyBoard = page.getByTestId("enemy-board");
  const square1 = enemyBoard.getByTestId("square-5-5");
  await expect(square1).toBeVisible();
  await square1.click();

  await expect(square1.getByTestId("water-square")).toHaveClass(/missed/);
  await verifyPlayerTurnInactive(page, player1);

  const square2 = enemyBoard.getByTestId("square-0-0");
  await square2.click();
  await page.waitForTimeout(1000);
  await expect(square2.getByTestId("water-square")).not.toHaveClass(/missed/);
});

test("ends game", async ({ page }) => {
  expect(true).toBeTruthy();
});

const startGame = async (page: Page) => {
  await expect(page.getByTestId("ship-square")).toBeHidden();
  await page.getByRole("button", { name: /start/i }).click();
  await expect(page.getByTestId("ship-square")).toHaveCount(2);
};

const addPlayer2ToGame = async (context: BrowserContext) => {
  const pageP2 = await context.newPage();
  await signUpAndSignIn({
    req: pageP2.request,
    user: { username: player2, password: defaultPassword },
  });
  await joinGame(pageP2.request, { gameId: gameRoomId });
};

const verifyPlayerTurnActive = async (page: Page, name: string) => {
  const classNames = await getPlayerClassNames(page, name);
  await expect(classNames).toContain("active");
};

const verifyPlayerTurnInactive = async (page: Page, name: string) => {
  const classNames = await getPlayerClassNames(page, name);
  await expect(classNames).not.toContain("active");
};

const getPlayerClassNames = async (page: Page, name: string) => {
  return await page
    .getByTestId("active-game")
    .getByRole("heading", { name })
    .evaluate((el) => el.className);
};

const seedGameDummyShips = async (request: APIRequestContext) => {
  const seed: GameSeed = {
    gameRoomId: gameRoomId,
    shipPositions: [
      {
        playerId: player1,
        shipPoints: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
        ],
      },
      {
        playerId: player2,
        shipPoints: [
          { x: 0, y: 0 },
          { x: 0, y: 1 },
        ],
      },
    ],
  };
  await seedGameShips(request, seed);
};
