import { Request, Response, NextFunction } from "express";

export type ApiErrorArgs = {
  status: number;
  errorMessage: string;
  error: Error;
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly errorMessage: string;

  constructor(message: string, status: number = 500) {
    super(message);
    this.status = status;
    this.errorMessage = message;
  }
}

export const errorHandleMiddleware = (
  error: Error | ApiError | undefined,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!error) {
    next();
    return;
  }

  if (error instanceof ApiError) {
    return res.status(error.status).json({ error: error.errorMessage });
  } else {
    console.log(`[ErrorMiddleware] Caught exception: ${error.message}`);
    return res.status(500).json({ error: "Internal server error" });
  }
  next(error);
};
