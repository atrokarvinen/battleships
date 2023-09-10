import { Router } from "express";
import { validationMiddleware } from "../middleware/validationMiddleware";
import { AuthController } from "./authController";
import { signInValidation, signUpValidation } from "./validation";

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

  return router;
};
