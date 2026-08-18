import type { NextResponse } from "next/server";
import { ACCESS_COOKIE, ACCESS_TTL_SEC, REFRESH_COOKIE, REFRESH_TTL_SEC } from "./keys";

export function setAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string,
): void {
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "strict",
    secure,
    path: "/",
    maxAge: ACCESS_TTL_SEC,
  });
  res.cookies.set(REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: "strict",
    secure,
    path: "/",
    maxAge: REFRESH_TTL_SEC,
  });
}

export function clearAuthCookies(res: NextResponse): void {
  res.cookies.set(ACCESS_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
  res.cookies.set(REFRESH_COOKIE, "", {
    httpOnly: true,
    sameSite: "strict",
    path: "/",
    maxAge: 0,
  });
}