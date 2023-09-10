import { test } from "./game-join-fixture";

test.beforeEach(async ({ page1 }) => {
  await page1.goToLobby()
});

test("joins game", async ({ page1, gameRoom, user1 }) => {
  await page1.joinGame(gameRoom.name);
  await page1.goToLobby();
  await page1.expectUserInGameRoom(gameRoom.name, user1.name);
});

test("leaves game", async ({ page1, gameRoom, user1 }) => {
  await page1.joinGame(gameRoom.name);
  await page1.goToLobby();
  await page1.openGameDetails(gameRoom.name);
  await page1.leaveGame();
  await page1.expectUserNotInGameRoom(gameRoom.name, user1.name);
});

test("cannot join same game twice", async ({ page1, gameRoom }) => {
  await page1.joinGame(gameRoom.name);
  await page1.goToLobby();

  // Try to join second time
  await page1.openGameDetails(gameRoom.name);
  await page1.expectUserAlreadyInGameRoom();
});

test("persists game join after page reload", async ({
  page1,
  gameRoom,
  user1,
}) => {
  await page1.joinGame(gameRoom.name);
  await page1.goToLobby();
  await page1.page.reload();
  await page1.expectUserInGameRoom(gameRoom.name, user1.name);
});

test("game join is broadcasted", async ({ page1, page2, user1, gameRoom }) => {
  await page2.goToLobby();
  await page2.verifyGameRoomVisible(gameRoom.name)
  
  await page1.expectUserNotInGameRoom(gameRoom.name, user1.name);
  await page2.expectUserNotInGameRoom(gameRoom.name, user1.name);
  
  await page1.joinGame(gameRoom.name);
  await page1.goToLobby();
  await page1.expectUserInGameRoom(gameRoom.name, user1.name);
  await page2.expectUserInGameRoom(gameRoom.name, user1.name);
});

test("game leave is broadcasted", async ({ page1, page2, user1, gameRoom }) => {
  await page2.goToLobby();
  await page2.verifyGameRoomVisible(gameRoom.name)
  
  await page1.joinGame(gameRoom.name);
  await page1.goToLobby();
  await page1.openGameDetails(gameRoom.name);

  await page1.expectUserInGameRoom(gameRoom.name, user1.name);
  await page2.expectUserInGameRoom(gameRoom.name, user1.name);

  await page1.leaveGame();

  await page1.expectUserNotInGameRoom(gameRoom.name, user1.name);
  await page2.expectUserNotInGameRoom(gameRoom.name, user1.name);
});