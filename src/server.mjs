import express, { json } from "express";
import config from "./config/config.js";
import helmet from "helmet";
import cors from "cors";
// Routes
import userRoutes from "./router/user.router.mjs";
import authRoutes from "./router/auth.router.mjs";

const app = express();
app.use(json());
app.use(cors( { origin: config.app.CORS_ORIGIN }));
app.use(helmet());

app.use(`/api/${config.app.API_VERSION}`, userRoutes);
app.use(`/api/${config.app.API_VERSION}`, authRoutes);

export default app;