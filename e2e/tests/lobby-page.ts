import { Page, expect } from "@playwright/test";
import { config } from "./config";

export class LobbyPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  getGameDetailsDialog = () => this.page.getByTestId("game-details-dialog");

  getGameRoom(title: string) {
    return this.page
      .getByTestId("game-row")
      .filter({ has: this.page.getByText(title) });
  }
  
  async goToLobby() {
    await this.page.goto(`${config.frontendUrl}/lobby`);
  }
  async goToLobbyFromLogo() {
    await this.page.getByRole("link", { name: "Battleships app" }).click();
  }

  async createGameRoom(title: string, againstAi = false) {
    await this.page.getByRole("button", { name: /create new game/i }).click();
    await this.page.getByLabel(/title/i).fill(title);

    if (againstAi) {
      await this.page.getByText(/computer/i).click();
    }

    await this.page.getByRole("button", { name: /submit/i }).click();
  }

  async verifyGameRoomVisible(title: string) {
    const gameRoomRow = this.getGameRoom(title);
    expect(gameRoomRow).toBeVisible();
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

  async leaveGameRoom(roomName: string) {
    if (!this.page.url().includes("lobby")) {
      await this.goToLobbyFromLogo();
    }

    const gameRow = this.page.getByTestId("game-row");
    await gameRow.getByText(roomName).click();

    await this.page.getByRole("button", { name: /leave/i }).click();
  }

  async verifyUserNotInGameRoom(roomName: string, username: string) {
    const gameRow = this.getGameRoom(roomName);
    await expect(gameRow).not.toContainText(username);
  }

  async verifyUserInGameRoom(roomName: string, username: string) {
    const gameRow = this.getGameRoom(roomName);
    await expect(gameRow).toContainText(username);
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
    await expect(dialog.getByRole("button", { name: /join/i })).toBeHidden();
    await expect(dialog.getByRole("button", { name: /go/i })).toBeEnabled();
  }

  async openGameDetails(title: string) {
    const gameRoomItem = this.getGameRoom(title);
    await gameRoomItem.click();
  }
}
