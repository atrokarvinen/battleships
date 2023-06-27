import { NextFunction, Request, Response } from "express";

export const logRequestMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.time("request");
  const { url, method } = req;
  const { statusCode } = res;
  console.log(`Handling request [${method}] ${url}`);
  res.on("finish", () => {
    console.log(`Handled request [${method}] ${url}. Response: ${statusCode}`);
    console.timeEnd("request");
  });
  next();
};
