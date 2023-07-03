import { NextFunction, Request, Response } from "express";

export const unknownRouteMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { url, method, route } = req;
  const msg = `No endpoint matched request [${method}] ${url}, route: ${route}`;
  console.log(msg);
  return next();
};
