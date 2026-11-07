import request from "supertest";
import { describe, expect, it } from "vitest";
import app from "../src/app.js";
import { createVerifiedUser } from "./support/auth.js";

describe("session and protected auth routes", () => {
  it("requires a refresh token", async () => {
    const response = await request(app).post("/api/v1/auth/refresh");

    expect(response.status).toBe(401);
    expect(response.body.code).toBe("TOKEN_ERROR");
  });

  it("refreshes a valid session", async () => {
    const user = await createVerifiedUser({
      email: "refresh@example.com",
      username: "refresh_user",
    });

    const response = await request(app)
      .post("/api/v1/auth/refresh")
      .set("Cookie", user.cookies);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Session refreshed successfully");
    expect(response.headers["set-cookie"]).toEqual(
      expect.arrayContaining([expect.stringContaining("refreshToken=")]),
    );
  });

  it("logs out without requiring an active session", async () => {
    const response = await request(app).post("/api/v1/auth/logout");

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Logged out successfully");
  });

  it("requires authentication for the current-user route", async () => {
    const response = await request(app).get("/api/v1/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.code).toBe("AUTHENTICATION_ERROR");
  });

  it("returns the authenticated user", async () => {
    const user = await createVerifiedUser({
      email: "me@example.com",
      username: "me_user",
    });

    const response = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", user.cookies);

    expect(response.status).toBe(200);
    expect(response.body.data.user).toMatchObject({
      email: user.email,
      username: user.username,
    });
    expect(response.body.data.user.passwordHash).toBeUndefined();
  });

  it("requires authentication for logout-all", async () => {
    const response = await request(app).post("/api/v1/auth/logout-all");

    expect(response.status).toBe(401);
    expect(response.body.code).toBe("AUTHENTICATION_ERROR");
  });

  it("revokes all sessions for the authenticated user", async () => {
    const user = await createVerifiedUser({
      email: "logout-all@example.com",
      username: "logout_all_user",
    });

    const response = await request(app)
      .post("/api/v1/auth/logout-all")
      .set("Cookie", user.cookies);

    expect(response.status).toBe(200);
    expect(response.body.message).toBe(
      "Logged out from all devices successfully",
    );

    const meResponse = await request(app)
      .get("/api/v1/auth/me")
      .set("Cookie", user.cookies);

    expect(meResponse.status).toBe(401);
    expect(meResponse.body.code).toBe("SESSION_ERROR");
  });
});
