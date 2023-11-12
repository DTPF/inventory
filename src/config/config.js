const dotenv = require("dotenv");

if (process.env.NODE_ENV === "production") {
  dotenv.config({ path: ".env.production" });
} else {
  dotenv.config({ path: ".env.development" });
}

const ENV = process.env.NODE_ENV || "development";

const CONFIG = {
  development: {
    app: {
      API_PORT: process.env.API_PORT || 4000,
      API_VERSION: process.env.API_VERSION,
      SALT_ROUNDS: process.env.SALT_ROUNDS,
      API_URL: `http://${process.env.API_IP}:${process.env.API_PORT}/api/${process.env.API_VERSION}`,
    },
    db: {
      MONGO_DB_URL: `mongodb://${process.env.API_IP}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}`
    },
    services: {
      EMAIL: process.env.EMAIL_DEV,
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD_DEV,
    }
  },
  production: {
    app: {
      API_PORT: process.env.API_PORT || 4000,
      API_VERSION: process.env.API_VERSION,
      SALT_ROUNDS: process.env.SALT_ROUNDS,
      API_URL: `http://${process.env.API_IP}:${process.env.API_PORT}/api/${process.env.API_VERSION}`,
    },
    db: {
      MONGO_DB_URL: `mongodb://admin:${process.env.MONGO_DB_PWD}@${process.env.API_IP}:${process.env.MONGO_DB_PORT}/${process.env.MONGO_DB_NAME}?authSource=admin`
    },
    services: {
      EMAIL: process.env.EMAIL_DEV,
      EMAIL_PASSWORD: process.env.EMAIL_PASSWORD_DEV,
    }
  },
};

module.exports = CONFIG[ENV];
