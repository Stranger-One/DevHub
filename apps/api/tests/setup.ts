import mongoose from "mongoose";
import { MongoMemoryReplSet } from "mongodb-memory-server";
import { afterAll, beforeAll, beforeEach, vi } from "vitest";
import { sentEmailTexts } from "./support/email.js";

process.env.NODE_ENV = "test";
process.env.ACCESS_TOKEN_SECRET = "test-access-token-secret-32-characters";
process.env.REFRESH_TOKEN_SECRET = "test-refresh-token-secret-32-characters";
process.env.REFRESH_TOKEN_HASH_SECRET =
  "test-refresh-hash-secret-32-characters";
process.env.OTP_HASH_SECRET = "test-otp-hash-secret-32-characters";
process.env.SMTP_HOST = "smtp.test";
process.env.SMTP_PORT = "1025";
process.env.SMTP_USER = "test-user";
process.env.SMTP_PASS = "test-password";
process.env.SMTP_FROM = "no-reply@test.devhub";

vi.mock("nodemailer", () => ({
  default: {
    createTransport: vi.fn(() => ({
      sendMail: vi.fn(async ({ text }: { text: string }) => {
        sentEmailTexts.push(text);
        return { messageId: "test-message-id" };
      }),
    })),
  },
}));

let mongoServer: MongoMemoryReplSet;

beforeAll(async () => {
  mongoServer = await MongoMemoryReplSet.create({
    replSet: { count: 1 },
  });
  await mongoose.connect(mongoServer.getUri());
});

beforeEach(async () => {
  await Promise.all(
    Object.values(mongoose.connection.collections).map((collection) =>
      collection.deleteMany({}),
    ),
  );
  sentEmailTexts.length = 0;
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});
