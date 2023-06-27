import { Request, Response, NextFunction } from "express";
import { User } from "../database/user";

export class AccountController {
  async getAccount(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = req.userId;
      const account = await User.findById(userId);
      if (!account) {
        return res.status(404).json({ message: `User '${userId}' not found` });
      }
      return res.json({ userId: account.id, username: account.username });
    } catch (error) {
      next(error);
    }
  }
}
