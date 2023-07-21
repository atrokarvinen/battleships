import { test } from "./game-join-fixture";

test("joins game", async ({ gameJoinPage, title, username }) => {
  await gameJoinPage.joinGame(title);
  await gameJoinPage.goToLobby();
  await gameJoinPage.expectUserInGameRoom(title, username);
});

test("leaves game", async ({ gameJoinPage, title, username }) => {
  await gameJoinPage.joinGame(title);
  await gameJoinPage.goToLobby();
  await gameJoinPage.openGameDetails(title);
  await gameJoinPage.leaveGame();
  await gameJoinPage.expectUserNotInGameRoom(title, username);
});

test("cannot join same game twice", async ({ gameJoinPage, title }) => {
  await gameJoinPage.joinGame(title);
  await gameJoinPage.goToLobby();

  // Try to join second time
  await gameJoinPage.openGameDetails(title);
  await gameJoinPage.expectUserAlreadyInGameRoom();
});

test("persists game join after page reload", async ({
  gameJoinPage,
  title,
  username,
}) => {
  await gameJoinPage.joinGame(title);
  await gameJoinPage.goToLobby();
  await gameJoinPage.page.reload();
  await gameJoinPage.expectUserInGameRoom(title, username);
});
