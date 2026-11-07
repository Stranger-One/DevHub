import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";
import {
  createVerifiedUser,
  latestOtp,
  TEST_PASSWORD,
} from "./support/auth.js";

describe("password recovery routes", () => {
  it("validates forgot-password input", async () => {
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "invalid" });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
  });

  it("returns not found when the recovery email is unknown", async () => {
    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: "missing@example.com" });

    expect(response.status).toBe(404);
    expect(response.body.code).toBe("RESOURCE_NOT_FOUND");
  });

  it("sends a password reset OTP", async () => {
    const user = await createVerifiedUser({
      email: "forgot@example.com",
      username: "forgot_user",
    });

    const response = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: user.email });

    expect(response.status).toBe(200);
    expect(response.body.data.user.id).toEqual(expect.any(String));
  });

  it("rejects an invalid reset OTP", async () => {
    const user = await createVerifiedUser({
      email: "invalid-reset@example.com",
      username: "invalid_reset_user",
    });

    const response = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({
        id: user.verification.body.data.user.id,
        newPassword: "NewPassword1!",
        otp: "000000",
      });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("OTP_ERROR");
  });

  it("resets the password and allows login with the new password", async () => {
    const user = await createVerifiedUser({
      email: "reset@example.com",
      username: "reset_user",
    });

    const forgotPassword = await request(app)
      .post("/api/v1/auth/forgot-password")
      .send({ email: user.email });

    const newPassword = "NewPassword1!";
    const reset = await request(app).post("/api/v1/auth/reset-password").send({
      id: forgotPassword.body.data.user.id,
      newPassword,
      otp: latestOtp(),
    });

    expect(reset.status).toBe(200);
    expect(reset.body.message).toBe("Password has been reset successfully.");

    const login = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: newPassword,
    });

    expect(login.status).toBe(200);
    expect(login.body.data.user.email).toBe(user.email);
  });

  it("rejects a reset password that does not meet the password policy", async () => {
    const response = await request(app)
      .post("/api/v1/auth/reset-password")
      .send({ id: "some-id", newPassword: "weak", otp: "123" });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
    expect(response.body.errors).toEqual(expect.any(Array));
  });
});
