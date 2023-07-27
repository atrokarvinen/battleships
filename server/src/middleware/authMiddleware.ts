import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_COOKIE_NAME } from "../core/constants";
import { env } from "../core/env";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const cookieName = JWT_COOKIE_NAME;
  const cookie = req.cookies[cookieName];
  if (!cookie) {
    const error = `Expected to find an auth cookie '${cookieName}'`;
    return res.status(403).end(error);
  }

  const token = jwt.verify(cookie, env.JWT_SECRET);
  const userId = (token as any).userId;

  if (!userId) {
    return res.status(403).end("UserId in the token is undefined");
  }

  req.userId = userId;

  // console.log(`Request userId: ${req.userId}`);

  return next();
};
