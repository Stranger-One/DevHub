import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";
import { createVerifiedUser, TEST_PASSWORD } from "./support/auth.js";

describe("POST /api/v1/auth/login", () => {
  it("rejects invalid login input", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "invalid",
      password: "",
    });

    expect(response.status).toBe(400);
    expect(response.body.code).toBe("VALIDATION_ERROR");
  });

  it("rejects invalid credentials", async () => {
    const response = await request(app).post("/api/v1/auth/login").send({
      email: "unknown@example.com",
      password: TEST_PASSWORD,
    });

    expect(response.status).toBe(401);
    expect(response.body.code).toBe("AUTHENTICATION_ERROR");
    expect(response.body.message).toBe("Invalid email or password");
  });

  it("logs in a verified user and sets authentication cookies", async () => {
    const user = await createVerifiedUser({
      email: "login@example.com",
      username: "login_user",
    });

    const response = await request(app).post("/api/v1/auth/login").send({
      email: user.email,
      password: user.password,
    });

    expect(response.status).toBe(200);
    expect(response.body.data.user).toMatchObject({
      email: user.email,
      username: user.username,
      role: "developer",
      emailVerified: true,
    });
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([
        expect.stringContaining("accessToken="),
        expect.stringContaining("refreshToken="),
      ]),
    );
  });
});
