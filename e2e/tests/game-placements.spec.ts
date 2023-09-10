import { test } from "./game-play-fixture";

test("starts game and confirms placements", async ({
  page1,
  user1,
  page2,
  gameRoom,
}) => {
  await page2.verifyGameVisible(gameRoom.name);
  await page1.startGame();

  await page1.verifyGameInPlacementsState();
  await page2.verifyGameInPlacementsState();

  // First player confirms placements. Player is ready but
  // game will not start until player 2 is ready as well
  await page1.confirmPlacements();
  await page1.verifyPlayerReady(user1.name);
  await page2.verifyPlayerReady(user1.name);
  await page1.verifyGameInPlacementsState();
  await page2.verifyGameInPlacementsState();

  // Player 2 is ready and game should be started
  await page2.confirmPlacements();
  await page1.verifyGameInStartedState();
  await page2.verifyGameInStartedState();
});

test("moves and rotates ship", async ({ seededPlacements }) => {
  await seededPlacements.page.reload();
  await seededPlacements.verifyGameInPlacementsState();

  await seededPlacements.clickPrimarySquare(0, 0);

  await seededPlacements.verifyOwnShipInSquare(0, 0);
  await seededPlacements.verifyOwnShipInSquare(0, 1);

  await seededPlacements.moveShipDown();

  await seededPlacements.verifyOwnShipInSquare(0, 1);
  await seededPlacements.verifyOwnShipInSquare(0, 2);

  await seededPlacements.rotateShip();

  await seededPlacements.verifyOwnShipInSquare(0, 1);
  await seededPlacements.verifyOwnShipInSquare(1, 1);
});
