import { Router } from 'express'
import * as controller from '../controllers/auth.controller.mjs'
const api = Router()

api.post("/refresh-tokens", controller.refreshTokens);
api.get("/verify/:token", controller.verifyEmail);
api.get("/resend-email-verification/:token", controller.resendEmailVerification);

export default api;