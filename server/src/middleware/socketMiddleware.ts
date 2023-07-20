import { NextFunction, Request, Response } from "express";

export const socketMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const socketId = req.headers["socket-id"];
    if (typeof socketId === "string") {
      req.socketId = socketId;
    }
    return next();
  } catch (error) {
    next(error);
  }
};
