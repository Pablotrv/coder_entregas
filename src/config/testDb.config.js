import { MongoMemoryServer } from "mongodb-memory-server";

let memoryServer;

export const ensureTestMongo = async () => {
  const current = process.env.MONGODB_URI || process.env.MONGO_URI || "";
  const isLocalMongo = /localhost|127\.0\.0\.1/.test(current);

  if (process.env.NODE_ENV === "test" && current && !isLocalMongo) {
    return current;
  }

  if (!memoryServer) {
    memoryServer = await MongoMemoryServer.create();
  }

  const mongoUri = memoryServer.getUri();
  process.env.MONGODB_URI = mongoUri;
  delete process.env.MONGO_URI;
  return mongoUri;
};
