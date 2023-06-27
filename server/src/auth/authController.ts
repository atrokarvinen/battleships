import { NextFunction, Request, Response } from "express";
import { SignUpPayload } from "./signUpPayload";
import { SignInPayload } from "./signInPayload";
import bcrypt from "bcrypt";
import { User } from "../database/user";
import jwt from "jsonwebtoken";
import { env } from "../core/env";
import { ValidationFailure } from "../core/validationFailure";

export class AuthController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log("signing up");
      const payload: SignUpPayload = req.body;
      const { username, password } = payload;

      const isUnique = await this.isUsernameUnique(username);
      if (!isUnique) {
        const msg = `Username '${username}' already exists`;
        const error: ValidationFailure = {
          errors: [{ path: "username", msg: msg }],
        };
        return res.status(400).json(error);
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = await User.create({
        username: username,
        password: hashedPassword,
      });

      res.status(200).json(createdUser.toObject());
    } catch (error) {
      next(error);
    }
  };

  async isUsernameUnique(username: string) {
    const foundUser = await User.findOne({ username });
    return foundUser === null;
  }

  signIn = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: SignInPayload = req.body;
      const { password, username } = payload;

      console.log(`Signing in user '${username}'...`);

      const user = await User.findOne({ username: username });

      if (!user) {
        console.log(`User '${username}' not found`);
        return res.status(403).json({ error: "Invalid username or password" });
      }
      const passwordsMatch = await bcrypt.compare(password, user.password);
      if (!passwordsMatch) {
        console.log(`Passwords did not match for user '${username}'`);
        return res.status(403).json({ error: "Invalid username or password" });
      }

      // Create token
      const secret = env.JWT_SECRET;
      const tokenInfo = { userId: user.id };
      const token = jwt.sign(tokenInfo, secret);
      const cookieName = env.JWT_COOKIE_NAME;

      console.log(`Successfully signed in user '${username}'`);
      res
        .status(200)
        .cookie(cookieName, token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .json({ username: username, userId: user.id, gamesJoined: [] });
    } catch (error) {
      next(error);
    }
  };

  async signOut(req: Request, res: Response, next: NextFunction) {
    try {
      const cookieName = env.JWT_COOKIE_NAME;
      res.clearCookie(cookieName).end();
    } catch (error) {
      next(error);
    }
  }

  deleteAllUsers = async (req: Request, res: Response) => {
    await User.deleteMany({});
    res.end();
  };

  testToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const cookies = req.cookies;
      const cookieName = env.JWT_COOKIE_NAME;
      const token = cookies[cookieName];
      console.log("cookies: " + JSON.stringify(cookies));

      const secret = env.JWT_SECRET;
      const tokenInfo: any = jwt.verify(token, secret);
      console.log("Token: " + JSON.stringify(tokenInfo));
      console.log("Token userId: " + tokenInfo.userId);
      res.end();
    } catch (error) {
      next(error);
    }
  };
}
