import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_COOKIE_NAME } from "../core/constants";
import { env } from "../core/env";
import { User } from "../database/user";

export class AccountController {
  async getAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const account = await User.findById(userId);
      if (!account) {
        return res.status(404).json({ error: `User '${userId}' not found` });
      }
      return res.json({ userId: account.id, username: account.username });
    } catch (error) {
      next(error);
    }
  }

  async getGuestAccountInfo(req: Request, res: Response, next: NextFunction) {
    const cookieName = JWT_COOKIE_NAME;
    const cookie = req.cookies[cookieName];
    if (!cookie) {
      const error = `Expected to find an auth cookie '${cookieName}'`;
      return res.status(403).end(error);
    }

    const token = jwt.verify(cookie, env.JWT_SECRET);
    const { userId, username } = token as any;
    return res.json({ userId, username });
  }
}
