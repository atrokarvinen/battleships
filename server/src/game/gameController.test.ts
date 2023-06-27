import { GameController } from "./gameController";
import request from "supertest";
import express, { Router } from "express";
import { gameRouter } from "./gameRouter";
import { Game } from "../database/game";
import mongoose from "mongoose";

const testRoute = async (req: any, res: any, next: any) => {
  console.log("creating...");
  try {
    const t = await Game.create({});
    return res.status(200).end();
  } catch (error) {
    return next(error);
  }
};

const testRouter = Router();

testRouter.post("/start", testRoute);

describe("api test", () => {
  let connection: any;
  beforeAll(async () => {
    connection = await mongoose.connect("mongodb://localhost:27017/battleship");
  });

  afterAll(async () => {
    await connection?.disconnect();
  });

  it("starts game", (done) => {
    const app = express();
    app.use("/game", testRoute);
    request(app)
      .post("/game/start")
      .then((response) => {
        console.log("response");
        done();
      })
      .catch((err) => {
        console.log("error ");
        done();
      });
    // .end((error, response) => {
    //   console.log("error:", error);
    //   done();
    //   expect(response.status).toBe(200);
    // });
    // .catch((err) => {
    //   done();
    //   console.log("error in test:", err);
    // });
  });
});
