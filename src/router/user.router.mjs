import { Router } from "express";
import * as userController from "../controllers/user.controller.mjs";
import { ensureAuth } from "../middlewares/auth.middleware.mjs";
const api = Router();

api
  .get("/ping", userController.ping)
  .get("/get-user", [ensureAuth], userController.getUser)
  .post("/signup", userController.signUp)
  .post("/signin", userController.signIn)

export default api;