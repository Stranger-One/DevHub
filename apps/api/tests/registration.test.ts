import { Types } from "mongoose";
import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";
import { OTPModel } from "../src/modules/auth/models/otp.model.js";
import {
  createVerifiedUser,
  latestOtp,
  TEST_PASSWORD,
} from "./support/auth.js";

describe("registration routes", () => {
  it("rejects invalid registration input", async () => {
    const response = await request(app).post("/api/v1/auth/register").send({
      email: "not-an-email",
      password: "short",
    });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ field: "email" }),
        expect.objectContaining({ field: "password" }),
      ]),
    );
  });

  it.each([
    ["minimum length", "Aa1!"],
    ["maximum length", `Aa1!${"a".repeat(125)}`],
    ["lowercase character", "PASSWORD1!"],
    ["uppercase character", "password1!"],
    ["number", "Password!"],
    ["special character", "Password1"],
  ])("rejects passwords missing the %s rule", async (_rule, password) => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "password-rule@example.com", password });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
    expect(response.body.errors).toEqual(
      expect.arrayContaining([expect.objectContaining({ field: "password" })]),
    );
  });

  it("starts registration and sends an OTP", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "new@example.com", password: TEST_PASSWORD });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.data.user.id).toEqual(expect.any(String));
  });

  it("enforces the OTP cooldown and resends after it expires", async () => {
    const registration = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "resend@example.com", password: TEST_PASSWORD });

    const cooldownResponse = await request(app)
      .post("/api/v1/auth/register/resend-otp")
      .send({ id: registration.body.data.user.id });

    expect(cooldownResponse.status).toBe(429);
    expect(cooldownResponse.body.code).toBe("OTP_ERROR");

    await OTPModel.deleteMany({});

    const response = await request(app)
      .post("/api/v1/auth/register/resend-otp")
      .send({ id: registration.body.data.user.id });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "A new verification code has been sent.",
    );
  });

  it("returns not found for an unknown registration", async () => {
    const response = await request(app)
      .post("/api/v1/auth/register/resend-otp")
      .send({ id: new Types.ObjectId().toString() });

    expect(response.status).toBe(404);
    expect(response.body.code).toBe("RESOURCE_NOT_FOUND");
  });

  it("completes registration and sets authentication cookies", async () => {
    const user = await createVerifiedUser({
      email: "complete@example.com",
      username: "complete_user",
    });

    expect(user.verification.status).toBe(201);
    expect(user.verification.body.data.user.email).toBe(user.email);
    expect(user.verification.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("accessToken="),
        expect.stringContaining("refreshToken="),
      ]),
    );
  });

  it("rejects an invalid registration OTP", async () => {
    const registration = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "invalid-otp@example.com", password: TEST_PASSWORD });

    const response = await request(app)
      .post("/api/v1/auth/register/verify-otp")
      .send({
        id: registration.body.data.user.id,
        otp: "000000",
        username: "invalid_otp_user",
        role: "developer",
      });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("OTP_ERROR");
  });

  it("reports duplicate email and username separately", async () => {
    await createVerifiedUser({
      email: "duplicate@example.com",
      username: "taken_user",
    });

    const duplicateEmail = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "duplicate@example.com", password: TEST_PASSWORD });

    expect(duplicateEmail.status).toBe(409);
    expect(duplicateEmail.body.message).toBe(
      "An account with this email already exists",
    );

    const secondRegistration = await request(app)
      .post("/api/v1/auth/register")
      .send({ email: "different@example.com", password: TEST_PASSWORD });

    const duplicateUsername = await request(app)
      .post("/api/v1/auth/register/verify-otp")
      .send({
        id: secondRegistration.body.data.user.id,
        otp: latestOtp(),
        username: "taken_user",
        role: "client",
      });

    expect(duplicateUsername.status).toBe(409);
    expect(duplicateUsername.body.message).toBe(
      "This username is already taken",
    );
  });
});
