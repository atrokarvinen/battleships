import bcrypt from "bcrypt";
import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { JWT_COOKIE_NAME } from "../core/constants";
import { env } from "../core/env";
import { User } from "../database/user";
import { generateGuid, getRandomGuestName } from "./guestNames";
import { SignInPayload } from "./models/signInPayload";
import { SignUpPayload } from "./models/signUpPayload";

export class AuthController {
  signUp = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const payload: SignUpPayload = req.body;
      const { username, password } = payload;

      console.log(`Signing up user '${username}'...`);

      const isUnique = await this.isUsernameUnique(username);
      if (!isUnique) {
        const error = `Username '${username}' already exists`;
        return res.status(400).json({ error });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      const createdUser = await User.create({
        username: username,
        password: hashedPassword,
        gamesJoined: [],
      });

      console.log(`Signed up user '${username}'.`);

      res.status(200).json(createdUser.toObject());
    } catch (error) {
      next(error);
    }
  };

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

      const token = this.createToken(user.id);
      const cookieName = JWT_COOKIE_NAME;

      console.log(`Successfully signed in user '${username}'`);
      res
        .status(200)
        .cookie(cookieName, token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .json({
          username: username,
          userId: user.id,
          gamesJoined: user.gamesJoined,
        });
    } catch (error) {
      next(error);
    }
  };

  signInAsGuest = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const username = getRandomGuestName();
      const userId = generateGuid();
      const token = this.createToken(userId);
      const cookieName = JWT_COOKIE_NAME;

      console.log(`Successfully created guest user '${username}'`);
      res
        .status(200)
        .cookie(cookieName, token, {
          httpOnly: true,
          sameSite: "none",
          secure: true,
        })
        .json({ username: username, userId, gamesJoined: [] });
    } catch (error) {
      next(error);
    }
  };

  signOut = async (req: Request, res: Response, next: NextFunction) => {
    try {
      console.log(`Logging out user '${req.userId}'...`);
      const cookieName = JWT_COOKIE_NAME;
      res.clearCookie(cookieName).end();
    } catch (error) {
      next(error);
    }
  };

  private async isUsernameUnique(username: string) {
    const foundUser = await User.findOne({ username });
    return foundUser === null;
  }

  private createToken(userId: string) {
    const secret = env.JWT_SECRET;
    const tokenInfo = { userId };
    const token = jwt.sign(tokenInfo, secret);
    return token;
  }
}
