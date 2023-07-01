import { test as base } from "@playwright/test";
import { createGameRoom, joinGame, signIn, signUpAndSignIn } from "./common";
import { config } from "./config";
import { defaultPassword } from "./defaults";
import { GamePlayPage } from "./game-play-page";

const gameName = "test game";
const player1 = "Player 1";
const player2 = "Player 2";

let gameRoomId: string;

type MyFixture = {
  gamePlayPage: GamePlayPage;
  gameName: string;
  player1: string;
  player2: string;
};

export const test = base.extend<MyFixture>({
  gamePlayPage: async ({ page, context }, use) => {
    const { request } = page;
    // Set up the fixture.
    const gamePlayPage = new GamePlayPage(page, context, player1, player2);

    await gamePlayPage.cleanup(gameName, player1, player2);

    const response = await createGameRoom(request, { title: gameName });
    const createdGameRoom = await response.json();
    gameRoomId = createdGameRoom.id;
    gamePlayPage.setGameRoomId(gameRoomId);

    await signUpAndSignIn({
      req: request,
      user: { username: player1, password: defaultPassword },
    });

    await joinGame(request, { gameId: createdGameRoom.id });
    await gamePlayPage.addPlayerToGame(player2, gameRoomId);

    await signIn({
      req: request,
      user: { username: player1, password: defaultPassword },
    });

    await page.goto(`${config.frontendUrl}/game/${gameRoomId}`);

    // Use the fixture value in the test.
    await use(gamePlayPage);

    // Clean up the fixture.
    // await gamePlayPage.cleanup(request, gameName, player1, player2);
  },

  gameName,
  player1,
  player2,
});
