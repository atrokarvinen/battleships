import { Router } from "express";
import { AccountController } from "./accountController";

export const accountRouter = Router();

const controller = new AccountController();

accountRouter.get("/", controller.getAccount);
