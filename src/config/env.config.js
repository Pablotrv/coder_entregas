import dotenv from "dotenv";

if (process.env.NODE_ENV !== "test") {
  dotenv.config();
}

const requiredEnvVars = ["PORT", "NODE_ENV"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    process.env[key] = key === "PORT" ? "8080" : "development";
  }
});

const rawMongoUri = process.env.MONGODB_URI || process.env.MONGO_URI || "";
const isLocalMongoUri = /localhost|127\.0\.0\.1/.test(rawMongoUri);
const mongoUri =
  process.env.NODE_ENV === "test"
    ? rawMongoUri && !isLocalMongoUri
      ? rawMongoUri
      : ""
    : rawMongoUri;

if (!mongoUri && process.env.NODE_ENV !== "test") {
  throw new Error(
    "[Config Error] La variable de entorno MONGODB_URI es requerida.",
  );
}

export const config = Object.freeze({
  port: Number(process.env.PORT || 8080),
  mongoUri: mongoUri || "",
  env: process.env.NODE_ENV || "development",
  uploadDir: process.env.UPLOAD_DIR || "./uploads",
  maxFileSize: Number(process.env.MAX_FILE_SIZE || 5 * 1024 * 1024),
});
