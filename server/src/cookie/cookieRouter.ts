import { Router } from "express";
import { JWT_COOKIE_NAME } from "../core/constants";
import {
  genCookie,
  genHttpOnlyCookie,
  genSecureCookie,
  getCookie,
  postCookie,
} from "./cookie-test";

export const cookieRouter = Router();

const cookieName = JWT_COOKIE_NAME;

cookieRouter.get("/", (req, res) => {
  res.cookie(cookieName, "cookieValue", {
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

cookieRouter.get("/test-cookie/get", getCookie);
cookieRouter.get("/test-cookie/gen", genCookie);
cookieRouter.get("/test-cookie/secure/gen", genSecureCookie);
cookieRouter.get("/test-cookie/http/gen", genHttpOnlyCookie);
cookieRouter.post("/test-cookie/post", postCookie);
