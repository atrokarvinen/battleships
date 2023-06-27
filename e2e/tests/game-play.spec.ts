import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  // Create two players
  // Create game room
  // Create game
  // Method to set game state
});

test.afterEach(async ({ page }) => {
  // Delete players
  // Delete game room
  // Delete game
});

test("starts game", () => {
  expect(true).toBeTruthy();
});

test("cannot start game when game already started", () => {
  expect(true).toBeTruthy();
});

test("cannot start game if player count is not two", () => {
  expect(true).toBeTruthy();
});

test("changes player order correctly", () => {
  // No change when player guesses correctly

  // Change when player guesses incorrectly

  expect(true).toBeTruthy();
});

test("ends game when all ships are destroyed", () => {
  // Cannot guess when game is over
  expect(true).toBeTruthy();
});

test("marks guesses with correct styling", () => {
  // 1) Hit own board
  // 2) Hit enemy board
  // 3) Miss own board
  // 4) Miss enemy board
  expect(true).toBeTruthy();
});

test("loads the game when page is refreshed", () => {
  expect(true).toBeTruthy();
});

test("cannot guess when not own turn", () => {
  expect(true).toBeTruthy();
});

test("ends game", () => {
  expect(true).toBeTruthy();
});
