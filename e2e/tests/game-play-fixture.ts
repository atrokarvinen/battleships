import { test as base } from "@playwright/test";
import {
  createGameRoom,
  joinGame,
  signIn,
  signUpAndSignIn,
  uniquefy,
} from "./common";
import { config } from "./config";
import { defaultPassword } from "./defaults";
import { GamePlayPage } from "./game-play-page";

let gameRoomId: string;

type GameFixture = {
  gamePlayPage: GamePlayPage;
};

export const test = base.extend<GameFixture>({
  gamePlayPage: async ({ page, context }, use) => {
    const gameName = uniquefy("test game");
    const player1 = uniquefy("Player 1");
    const player2 = uniquefy("Player 2");

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
    await gamePlayPage.cleanup(gameName, player1, player2);
  },
});
