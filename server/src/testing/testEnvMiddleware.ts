import { NextFunction, Request, Response } from "express";
import { env } from "../core/env";

export const testEnvMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (env.NODE_ENV !== "development") {
    console.log(
      'Test route blocked in env "%s" !== "development"',
      env.NODE_ENV
    );
    return res
      .status(403)
      .json({ error: "Route is only available in test environment" });
  }
  return next();
};
