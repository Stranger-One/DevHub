import argon2 from "argon2";

const ARGON2_OPTIONS = {
  type: argon2.argon2id,
  memoryCost: 19456,
  timeCost: 2,
  parallelism: 1,
} as const;

export const hashPassword = async (password: string): Promise<string> => {
  return argon2.hash(password, ARGON2_OPTIONS);
};

export const comparePassword = async (
  password: string,
  passwordHash: string,
): Promise<boolean> => {
  try {
    return await argon2.verify(passwordHash, password);
  } catch {
    return false;
  }
};
