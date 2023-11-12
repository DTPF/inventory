import { Router } from "express";
import * as userController from "../controllers/user.controller.mjs";
import { ensureSelfAuth } from "../middlewares/auth.middleware.mjs";
const api = Router();

api
  .get("/ping", userController.ping)
  .get("/get-user", [ensureSelfAuth], userController.getUser)
  .post("/signup", userController.signUp)
  .post("/signin", userController.signIn)

export default api;