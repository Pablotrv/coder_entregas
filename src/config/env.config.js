import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["PORT", "MONGODB_URI", "NODE_ENV"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(
      `[Config Error] La variable de entorno ${key} es requerida.`,
    );
  }
});

export const config = Object.freeze({
  port: process.env.PORT,
  mongoUri: process.env.MONGODB_URI,
  env: process.env.NODE_ENV,
});
