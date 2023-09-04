import { Page, expect } from "@playwright/test";

export class LobbyPage {
  page: Page;

  constructor(page: Page) {
    this.page = page;
  }

  async goToLobby() {
    await this.page.getByRole("link", { name: "Battleships app" }).click();
  }

  async leaveGameRoom(roomName: string) {
    if (!this.page.url().includes("lobby")) {
      await this.goToLobby();
    }

    const gameRow = this.page.getByTestId("game-row");
    await gameRow.getByText(roomName).click();

    await this.page.getByRole("button", { name: /leave/i }).click();
  }

  async verifyUserNotInGameRoom(roomName: string, username: string) {
    const gameRow = this.page
      .getByTestId("game-row")
      .filter({ has: this.page.getByText(roomName) });
    await expect(gameRow).not.toHaveText(username);
  }
}
