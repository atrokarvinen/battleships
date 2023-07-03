import { Request, Response } from "express";

const getLocalTime = () => new Date().toLocaleTimeString();

export const getCookie = (req: Request, res: Response) => {
  const cookies = req.cookies;
  console.log("cookies:", cookies);
  res.end();
};

export const genCookie = (req: Request, res: Response) => {
  console.log("generating test cookie...");
  res.cookie("my-test-cookie", "some_value_" + getLocalTime(), {
    maxAge: 10_000,
    sameSite: "lax",
    secure: true,
  });
  res.end();
};

export const genSecureCookie = (req: Request, res: Response) => {
  console.log("generating secure cookie...");
  res.cookie("my-secure-cookie", "secure_value_" + getLocalTime(), {
    sameSite: "none",
    secure: true,
  });
  res.end();
};

export const genHttpOnlyCookie = (req: Request, res: Response) => {
  console.log("generating http only cookie...");
  res.cookie("my-http-cookie", "http_value_" + getLocalTime(), {
    sameSite: "none",
    secure: true,
    httpOnly: true,
  });
  res.end();
};

export const postCookie = (req: Request, res: Response) => {
  console.log("posting cookie...");
  const cookies = req.cookies;
  console.log("cookies in post request:", cookies);
  res.end();
};
