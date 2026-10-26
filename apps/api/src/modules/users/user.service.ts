import { hashPassword, verifyPassword } from "./password.utils.js";
import { UserModel } from "./user.model.js";
import type { LoginUserInput, RegisterUserInput } from "./user.validation.js";

export class DuplicateUserError extends Error {
  constructor() {
    super("An account with this email or username already exists.");
    this.name = "DuplicateUserError";
  }
}
export class AuthError extends Error {
  constructor(
    message: string,
    public readonly statusCode: number,
  ) {
    super(message);
    this.name = "AuthError";
  }
}

function isDuplicateKeyError(error: unknown): boolean {
  if (typeof error !== "object" || error === null) {
    return false;
  }

  return "code" in error && error.code === 11000;
}

export async function registerUser(input: RegisterUserInput) {
  const { email, username, password, role } = input;

  const passwordHash = await hashPassword(password);

  try {
    const user = await UserModel.create({
      email,
      username,
      passwordHash,
      role,
    });

    return user;
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      throw new AuthError("An account with this email or username already exists.", 409);
    }

    throw error;
  }
}

export async function loginUser(input: LoginUserInput) {
  const user = await UserModel.findOne({
    email: input.email,
  }).select("+passwordHash");

  if (!user) {
    throw new AuthError("Invalid email or password", 401);
  }

  const matches = await verifyPassword(input.password, user.passwordHash!);

  if (!matches) {
    throw new AuthError("Invalid email or password", 401);
  }

  return user;
}
