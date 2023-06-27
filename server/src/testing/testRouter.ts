import { Router, Response, Request, NextFunction } from "express";
import { User } from "../database/user";
import { GameRoom } from "../database/gameRoom";

export const testRouter = Router();

export const testEnvMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const isTestEnvironment = true;
  if (!isTestEnvironment) {
    return res
      .status(403)
      .json({ message: "Route is only available in test environment" });
  }
  return next();
};

export const deleteAllUsers = async (req: Request, res: Response) => {
  await User.deleteMany({});
  res.end();
};

export const deleteUserByName = async (req: Request, res: Response) => {
  const username = req.params.name;
  await User.deleteMany({ username });
  res.end();
};

export const deleteGameByTitle = async (req: Request, res: Response) => {
  const title = req.params.title;
  await GameRoom.deleteMany({ title });
  res.end();
};

testRouter.delete("/users", deleteAllUsers);
testRouter.delete("/users/:name", deleteUserByName);

testRouter.delete("/games/:title", deleteGameByTitle);
