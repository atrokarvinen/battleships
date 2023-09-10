import { NextFunction, Request, Response } from "express";
import { User } from "../auth/userSchema";

export class AccountController {
  async getAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const account = await User.findById(userId);
      if (!account) {
        return res.status(404).json({ error: `User '${userId}' not found` });
      }
      res.json({ userId: account.id, username: account.username });
    } catch (error) {
      next(error);
    }
  }
}
