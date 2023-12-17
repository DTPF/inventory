import { Router } from 'express'
import * as controller from '../controllers/auth.controller.mjs'
const api = Router()

api.post("/refresh-tokens", controller.refreshTokens);
api.get("/verify", controller.verifyEmail);
api.get("/resend-email-verification", controller.resendEmailVerification);

export default api;