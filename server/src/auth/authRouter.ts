import { Router } from "express";
import { AuthController } from "./authController";
import {
  genCookie,
  genHttpOnlyCookie,
  genSecureCookie,
  getCookie,
  postCookie,
} from "./cookie-test";
import { signInValidation, signUpValidation } from "./validation";
import { validationMiddleware } from "../middleware/validationMiddleware";

export const authRouter = () => {
  const router = Router();
  const authController = new AuthController();

  router.post(
    "/sign-up",
    signUpValidation,
    validationMiddleware,
    authController.signUp
  );
  router.post(
    "/sign-in",
    signInValidation,
    validationMiddleware,
    authController.signIn
  );
  router.post("/sign-out", authController.signOut);
  router.delete("/", authController.deleteAllUsers);
  router.post("/test-token", authController.testToken);
  router.get("/test-cookie/get", getCookie);
  router.get("/test-cookie/gen", genCookie);
  router.get("/test-cookie/secure/gen", genSecureCookie);
  router.get("/test-cookie/http/gen", genHttpOnlyCookie);
  router.post("/test-cookie/post", postCookie);
  router.get("/redirect", (req, res) => {
    return res.redirect("http://localhost:5173/login");
  });

  return router;
};
