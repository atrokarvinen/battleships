import { test } from "./game-play-fixture";

test("starts a game against ai", async ({ aiLobby, aiGameTitle, aiPage }) => {
  await aiLobby.createGameRoom(aiGameTitle, true);
  await aiLobby.verifyGameRoomVisible(aiGameTitle);

  await aiLobby.page.reload();

  await aiLobby.verifyUserInGameRoom(aiGameTitle, "AI");

  await aiLobby.joinGame(aiGameTitle);

  await aiPage.startGame();
  await aiPage.verifyGameInPlacementsState();
  await aiPage.confirmPlacements();
  await aiPage.verifyGameInStartedState();
});
