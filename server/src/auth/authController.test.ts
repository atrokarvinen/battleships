import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";
import { env } from "../core/env";
import { User } from "../database/user";
import { SignInPayload } from "./models/signInPayload";
import { SignUpPayload } from "./models/signUpPayload";

beforeAll(async () => {
  await mongoose.connect(env.DB_CONNECTION_STRING_TESTS);
});

beforeEach(async () => {
  await cleanup();
});

afterAll(async () => {
  await cleanup();
  await mongoose.connection.close();
  jest.restoreAllMocks();
});

const cleanup = async () => {
  await User.deleteMany({});
};

const validPayload: SignUpPayload = {
  username: "username",
  password: "Salasana1",
  confirmPassword: "Salasana1",
};

it("signs up", async () => {
  await request(app).post("/auth/sign-up").send(validPayload).expect(200);
});

it("sign up fails when password is not given", async () => {
  const payload: SignUpPayload = {
    username: "username",
    password: "",
    confirmPassword: "",
  };
  await request(app).post("/auth/sign-up").send(payload).expect(400);
});

it("signs in", async () => {
  await request(app).post("/auth/sign-up").send(validPayload);

  const signInPayload: SignInPayload = {
    username: validPayload.username,
    password: validPayload.password,
  };
  await request(app).post("/auth/sign-in").send(signInPayload).expect(200);
});

it("sign in gives error response when user does not exist", async () => {
  const signInPayload: SignInPayload = {
    username: "ghost",
    password: validPayload.password,
  };
  await request(app).post("/auth/sign-in").send(signInPayload).expect(403);
});
