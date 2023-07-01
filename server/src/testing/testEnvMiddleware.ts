import { NextFunction, Request, Response } from "express";

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
