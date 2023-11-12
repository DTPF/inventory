import { connect } from "mongoose";
import server from "./server.mjs";
import config from "./config/config.js";

try {
  server.listen(config.app.API_PORT, async () => {
    await connect(config.db.MONGO_DB_URL);
    console.log(`Running on PORT ${config.app.API_PORT}...`);
  });
} catch (error) {
  throw new Error();
}