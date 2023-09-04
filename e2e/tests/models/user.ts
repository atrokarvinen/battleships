import { APIRequestContext } from "@playwright/test";
import { deleteUserByName, signIn, signUpAndSignIn, uniquefy } from "../common";
import { defaultPassword } from "../defaults";

export class User {
  request: APIRequestContext;
  name: string;

  constructor(request: APIRequestContext, name: string) {
    this.request = request;
    this.name = uniquefy(name);
  }

  async create() {
    const user = { username: this.name, password: defaultPassword };
    await signUpAndSignIn({ req: this.request, user });
  }

  async signIn() {
    const user = { username: this.name, password: defaultPassword };
    await signIn({ req: this.request, user });
  }

  async cleanup() {
    await deleteUserByName(this.request, this.name);
  }
}
