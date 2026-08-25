import dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["PORT", "NODE_ENV"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(
      `[Config Error] La variable de entorno ${key} es requerida.`,
    );
  }
});

const mongoUri = process.env.MONGODB_URI || process.env.MONGO_URI;
if (!mongoUri) {
  throw new Error(
    "[Config Error] La variable de entorno MONGODB_URI es requerida.",
  );
}

export const config = Object.freeze({
  port: process.env.PORT,
  mongoUri,
  env: process.env.NODE_ENV,
  uploadDir: process.env.UPLOAD_DIR || "./uploads",
  maxFileSize: Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024),
});
