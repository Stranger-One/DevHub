import { describe, it, expect } from "vitest";
import request from "supertest";
import mongoose from "mongoose";
import app from "../../src/app.js";
import { UserModel } from "../../src/modules/users/user.model.js";

describe("POST /api/auth/register", () => {
  it("registers a user and never returns their password hash", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "Developer@Example.com",
      username: "Dev_User",
      password: "SecurePass123!",
      role: "DEVELOPER",
    });

    expect(response.status).toBe(201);
    expect(response.body.data.user.email).toBe("developer@example.com");
    expect(response.body.data.user.username).toBe("dev_user");
    expect(response.body.data.user.role).toBe("DEVELOPER");
    expect(response.body.data.user).not.toHaveProperty("password");
    expect(response.body.data.user).not.toHaveProperty("passwordHash");

    const storedUser = await UserModel.findOne({
      email: "developer@example.com",
    }).select("+passwordHash");

    expect(storedUser).not.toBeNull();
    expect(storedUser!.passwordHash).not.toBe("SecurePass123!");
    expect(storedUser!.passwordHash).toBeTruthy();
  });

  it.each([
    {
      case: "minimum length",
      password: "Aa1!",
      expectedMessage: "Password must contain at least 8 characters",
    },
    {
      case: "maximum length",
      password: "Aa1!" + "b".repeat(125),
      expectedMessage: "Password must not exceed 128 characters",
    },
    {
      case: "uppercase letter",
      password: "securepass123!",
      expectedMessage: "Password must contain at least one uppercase letter",
    },
    {
      case: "lowercase letter",
      password: "SECUREPASS123!",
      expectedMessage: "Password must contain at least one lowercase letter",
    },
    {
      case: "number",
      password: "SecurePass!!",
      expectedMessage: "Password must contain at least one number",
    },
    {
      case: "special character",
      password: "SecurePass123",
      expectedMessage: "Password must contain at least one special character",
    },
  ])(
    "rejects a password missing $case or violating its rule",
    async ({ password, expectedMessage }) => {
      const response = await request(app).post("/api/auth/register").send({
        email: "weak@example.com",
        username: "weak_user",
        password,
        role: "developer",
      });

      expect(response.status).toBe(400);
      expect(response.body.message).toBe("Validation failed");
      expect(response.body.errors).toContainEqual(
        expect.objectContaining({
          field: "password",
          message: expectedMessage,
        }),
      );

      expect(await UserModel.findOne({ email: "weak@example.com" })).toBeNull();
    },
  );

  it("rejects duplicate email addresses", async () => {
    const user = {
      email: "duplicate@example.com",
      username: "first_user",
      password: "SecurePass123!",
      role: "DEVELOPER",
    };

    const firstResponse = await request(app)
      .post("/api/auth/register")
      .send(user);

    // console.log("FIRST RES:", firstResponse.status, firstResponse.body);

    expect(firstResponse.status).toBe(201);

    const secondResponse = await request(app)
      .post("/api/auth/register")
      .send({
        ...user,
        username: "second_user",
      });

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body.message).toBe(
      "An account with this email or username already exists.",
    );
  });

  it("rejects duplicate usernames", async () => {
    const firstResponse = await request(app).post("/api/auth/register").send({
      email: "first@example.com",
      username: "same_username",
      password: "SecurePass123!",
      role: "DEVELOPER",
    });

    expect(firstResponse.status).toBe(201);
    // console.log("FIRST RES:", firstResponse);

    const secondResponse = await request(app).post("/api/auth/register").send({
      email: "second@example.com",
      username: "same_username",
      password: "SecurePass123!",
      role: "CLIENT",
    });

    expect(secondResponse.status).toBe(409);
    expect(secondResponse.body.message).toBe(
      "An account with this email or username already exists.",
    );
  });

  it("rejects extra fields", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "extra@example.com",
      username: "extra_user",
      password: "SecurePass123!",
      role: "developer",
      isAdmin: true,
    });

    expect(response.status).toBe(400);
  });

  it("rejects an invalid role", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "role@example.com",
      username: "role_user",
      password: "SecurePass123!",
      role: "admin",
    });

    expect(response.status).toBe(400);
  });
});

describe("Database test setup", () => {
  it("connects to the test database", () => {
    expect(mongoose.connection.readyState).toBe(1);
  });
});
