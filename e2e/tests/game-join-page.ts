import { Page, expect } from "@playwright/test";
import { deleteGameRoomByTitle, deleteUserByName } from "./common";
import { config } from "./config";

export class GameJoinPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getGameRoom(title: string) {
    return this.page
      .getByTestId("game-row")
      .filter({ has: this.page.getByText(title) });
  }

  getGameDetailsDialog = () => this.page.getByTestId("game-details-dialog");

  async goToLobby() {
    await this.page.goto(`${config.frontendUrl}/lobby`);
  }

  async expectUserInGameRoom(title: string, username: string) {
    const gameRoomItem = this.getGameRoom(title);
    await expect(gameRoomItem.getByText(username)).toBeVisible();
  }

  async expectUserNotInGameRoom(title: string, username: string) {
    const gameRoomItem = this.getGameRoom(title);
    await expect(gameRoomItem.getByText(username)).toBeHidden();
  }

  async expectUserAlreadyInGameRoom() {
    const dialog = this.getGameDetailsDialog();
    await expect(dialog.getByRole("button", { name: /join/i })).toBeDisabled();
    await expect(dialog.getByRole("button", { name: /go/i })).toBeEnabled();
  }

  async openGameDetails(title: string) {
    const gameRoomItem = this.getGameRoom(title);
    await gameRoomItem.click();
  }

  async joinGame(title: string) {
    await this.openGameDetails(title);
    const dialog = this.getGameDetailsDialog();
    await dialog.getByRole("button", { name: /join/i }).click();
  }

  async leaveGame() {
    const dialog = this.getGameDetailsDialog();
    await dialog.getByRole("button", { name: /leave/i }).click();
  }

  async cleanup(titles: string[], usernames: string[]) {
    for (const title of titles) {
      await deleteGameRoomByTitle(this.page.request, title);
    }
    for (const username of usernames) {
      await deleteUserByName(this.page.request, username);
    }
  }
}
