import { afterAll, afterEach, beforeAll } from "vitest";
import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { connectDatabase } from "../src/config/db.js";
import { UserModel } from "../src/modules/users/user.model.js";

let mongoServer: MongoMemoryServer;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();

  // Point the existing database connector at the temporary database.
  process.env.MONGODB_URI = mongoServer.getUri("devhub_test");

  await connectDatabase();

  // Ensure unique email and username indexes exist before testing.
  await UserModel.init();
}, 60_000);

afterEach(async () => {
  // Remove test records while keeping database indexes intact.
  const collections = await mongoose.connection.db?.collections();

  if (collections) {
    await Promise.all(
      collections.map((collection) => collection.deleteMany({})),
    );
  }
});

afterAll(async () => {
  await mongoose.disconnect();

  if (mongoServer) {
    await mongoServer.stop();
  }
}, 60_000);
