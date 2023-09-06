import { Page } from "@playwright/test";
import { deleteUserByName, signIn, signUpAndSignIn, uniquefy } from "../common";
import { defaultPassword } from "../defaults";

export class UserApi {
  page: Page;
  name: string;

  constructor(page: Page, name: string) {
    this.page = page;
    this.name = uniquefy(name);
  }

  async create() {
    const user = { username: this.name, password: defaultPassword };
    await signUpAndSignIn({ req: this.page.request, user });
  }

  async signIn() {
    const user = { username: this.name, password: defaultPassword };
    await signIn({ req: this.page.request, user });
  }

  async cleanup() {
    await deleteUserByName(this.page.request, this.name);
  }
}
