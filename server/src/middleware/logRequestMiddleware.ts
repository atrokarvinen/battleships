import { NextFunction, Request, Response } from "express";

export const logRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { url, method } = req;
  res.on("finish", () => {
    const { statusCode } = res;
    console.log(`Handled request [${method}] ${url}. Response: ${statusCode}`);
  });
  next();
};
