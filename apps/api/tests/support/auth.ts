import request from "supertest";
import { sentEmailTexts } from "./email.js";
import app from "../../src/app.js";

export const TEST_PASSWORD = "ValidPassword1!";

export function latestOtp(): string {
  const emailText = sentEmailTexts.at(-1);
  const otp = emailText?.match(/is (\d{6})\./)?.[1];

  if (!otp) {
    throw new Error("The test email did not contain an OTP");
  }

  return otp;
}

export async function createVerifiedUser(
  options: {
    email?: string;
    username?: string;
  } = {},
) {
  const email = options.email ?? "user@example.com";
  const username = options.username ?? "test_user";

  const registration = await request(app).post("/api/v1/auth/register").send({
    email,
    password: TEST_PASSWORD,
  });

  const verification = await request(app)
    .post("/api/v1/auth/register/verify-otp")
    .send({
      id: registration.body.data.user.id,
      otp: latestOtp(),
      username,
      role: "developer",
    });

  return {
    email,
    username,
    password: TEST_PASSWORD,
    registration,
    verification,
    cookies: verification.headers["set-cookie"] as string,
  };
}
