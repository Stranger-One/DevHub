import { createAccessToken, createRefreshToken, createTokenFamilyId, getRefreshExpiry, hashRefreshToken } from "./auth.tokens.js";
import { RefreshSession } from "./session.model.js";
import { UserModel, type UserDocument } from "./user.model.js";
import { AuthError } from "./user.service.js";


export async function createSession(user: UserDocument) {
  const familyId = createTokenFamilyId();
  const refreshToken = createRefreshToken();
  const accessToken = createAccessToken({
    sub: user._id.toString(),
    role: user.role,
  });

  try {
    const session = await RefreshSession.create({
      userId: user._id,
      familyId,
      tokenHash: hashRefreshToken(refreshToken),
      status: "active",
      expiresAt: getRefreshExpiry(),
    });
  
    return {
      accessToken,
      refreshToken,
      expiresAt: session.expiresAt,
    };

  } catch (error) {
    throw new AuthError("Failed to create session", 500);
  }

}

export async function rotateRefreshToken(presentedToken: string) {
  const current = await RefreshSession.findOne({
    tokenHash: hashRefreshToken(presentedToken),
  });

  if (!current) {
    throw new AuthError("Invalid refresh token", 401);
  }

  if (current.status !== "active") {
    await RefreshSession.updateMany(
      { familyId: current.familyId, status: "active" },
      { $set: { status: "revoked", revokedAt: new Date() } },
    );

    throw new AuthError("Invalid refresh token", 401);
  }

  if (current.expiresAt.getTime() <= Date.now()) {
    current.status = "revoked";
    current.revokedAt = new Date();
    await current.save();
    throw new AuthError("Refresh token expired", 401);
  }

  const claimed = await RefreshSession.findOneAndUpdate(
    {
      _id: current._id,
      status: "active",
      expiresAt: { $gt: new Date() },
    },
    {
      $set: { status: "rotated", revokedAt: new Date() },
    },
    { returnDocument: "after" },
  );

  if (!claimed) {
    throw new AuthError("Refresh token already used", 401);
  }

  const user = await UserModel.findById(current.userId);

  if (!user) {
    await RefreshSession.updateMany(
      { familyId: current.familyId, status: "active" },
      { $set: { status: "revoked", revokedAt: new Date() } },
    );
    throw new AuthError("Account no longer exists", 401);
  }

  const refreshToken = createRefreshToken();

  await RefreshSession.create({
    userId: user._id,
    familyId: current.familyId,
    tokenHash: hashRefreshToken(refreshToken),
    status: "active",
    expiresAt: getRefreshExpiry(),
  });

  return {
    accessToken: createAccessToken({
      sub: user._id.toString(),
      role: user.role,
    }),
    refreshToken,
  };
}

export async function revokeRefreshToken(
  presentedToken: string,
): Promise<void> {
  const session = await RefreshSession.findOne({
    tokenHash: hashRefreshToken(presentedToken),
  });

  if (!session) return;

  await RefreshSession.updateMany(
    {
      familyId: session.familyId,
      status: "active",
    },
    {
      $set: {
        status: "revoked",
        revokedAt: new Date(),
      },
    },
  );
}
