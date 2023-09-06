import { test } from "./game-join-multi-user-fixture";

test("game join is broadcasted", async ({
  gameJoinPage,
  gameJoinPage2,
  title,
  username1,
}) => {
  await gameJoinPage.expectUserNotInGameRoom(title, username1);
  await gameJoinPage2.expectUserNotInGameRoom(title, username1);

  await gameJoinPage.joinGame(title);
  await gameJoinPage.goToLobby();
  await gameJoinPage.expectUserInGameRoom(title, username1);
  await gameJoinPage2.expectUserInGameRoom(title, username1);
});

test("game leave is broadcasted", async ({
  gameJoinPage,
  gameJoinPage2,
  title,
  username1,
}) => {
  await gameJoinPage.joinGame(title);
  await gameJoinPage.goToLobby();
  await gameJoinPage.openGameDetails(title);

  await gameJoinPage.expectUserInGameRoom(title, username1);
  await gameJoinPage2.expectUserInGameRoom(title, username1);

  await gameJoinPage.leaveGame();

  await gameJoinPage.expectUserNotInGameRoom(title, username1);
  await gameJoinPage2.expectUserNotInGameRoom(title, username1);
});
