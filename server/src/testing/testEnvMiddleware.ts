import { NextFunction, Request, Response } from "express";
import { env } from "../core/env";

export const testEnvMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (env.NODE_ENV === "development") {
    return res
      .status(403)
      .json({ message: "Route is only available in test environment" });
  }
  return next();
};
