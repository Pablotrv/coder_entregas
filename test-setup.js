import dotenv from "dotenv";
import { ensureTestMongo } from "./src/config/testDb.config.js";

dotenv.config({ override: true });

process.env.NODE_ENV = "test";
process.env.PORT = "8080";
delete process.env.MONGO_URI;
delete process.env.MONGODB_URI;

await ensureTestMongo();
