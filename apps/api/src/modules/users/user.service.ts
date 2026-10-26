import { hashPassword } from "./password.utils.js";
import { UserModel } from "./user.model.js";
import type { RegisterUserInput } from "./user.validation.js";


export class DuplicateUserError extends Error {
  constructor() {
    super("An account with this email or username already exists.");
    this.name = "DuplicateUserError";
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

  // Hash the password before storing it.
  const passwordHash = await hashPassword(password);

  try {
    const user = await UserModel.create({
      email,
      username,
      passwordHash,
      role,
    });

    // Return only fields that are safe for the client.
    return {
      id: user.id,
      email: user.email,
      username: user.username,
      role: user.role,
      emailVerified: user.emailVerified,
      // profile: user.profile,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error: unknown) {
    if (isDuplicateKeyError(error)) {
      throw new DuplicateUserError();
    }

    throw error;
  }
}
