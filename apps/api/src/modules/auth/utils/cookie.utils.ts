import type { Response, CookieOptions } from "express";
import type { AuthTokens } from "../auth.types.js";

const ACCESS_COOKIE = "accessToken";
const REFRESH_COOKIE = "refreshToken";

const isProduction = process.env.NODE_ENV === "production";

const sameSite = (process.env.COOKIE_SAME_SITE?.toLowerCase() ||
  "lax") as CookieOptions["sameSite"];

const cookieBaseOptions: CookieOptions = {
  httpOnly: true,
  secure: isProduction || sameSite === "none",
  sameSite,
};

const accessCookieOptions: CookieOptions = {
  ...cookieBaseOptions,
  path: "/",
  maxAge: 15 * 60 * 1000,
};

const refreshCookieOptions: CookieOptions = {
  ...cookieBaseOptions,
  path: "/api/auth",
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const setAuthCookies = (res: Response, tokens: AuthTokens): void => {
  res.cookie(ACCESS_COOKIE, tokens.accessToken, accessCookieOptions);

  res.cookie(REFRESH_COOKIE, tokens.refreshToken, refreshCookieOptions);
};

export const clearAuthCookies = (res: Response): void => {
  res.clearCookie(ACCESS_COOKIE, accessCookieOptions);
  res.clearCookie(REFRESH_COOKIE, refreshCookieOptions);
};

export const getRefreshTokenFromCookies = (
  cookies?: Record<string, unknown>,
): string | undefined => {
  const token = cookies?.[REFRESH_COOKIE];

  return typeof token === "string" ? token : undefined;
};

export const getAccessTokenFromCookies = (
  cookies?: Record<string, unknown>,
): string | undefined => {
  const token = cookies?.[ACCESS_COOKIE];

  return typeof token === "string" ? token : undefined;
};
