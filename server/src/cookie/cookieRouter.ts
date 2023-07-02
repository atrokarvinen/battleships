import { Router } from "express";
import { env } from "../core/env";

export const cookieRouter = Router();

const cookieName = env.JWT_COOKIE_NAME;

cookieRouter.get("/", (req, res) => {
  res.cookie(cookieName, "cookieValue", {
    // httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  res.json({ cookie: req.cookies[cookieName] });
});

cookieRouter.post("/", (req, res) => {
  const cookies = req.cookies;
  console.log("cookies: ", cookies);
  console.log("cookie: ", cookies[cookieName]);
  res.json({ cookie: cookies[cookieName] });
});
