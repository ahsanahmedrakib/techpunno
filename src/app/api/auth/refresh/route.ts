import { NextRequest, NextResponse } from "next/server";
import {
  verifyRefreshToken,
  createAccessToken,
  createRefreshToken,
} from "@/lib/auth/tokens";
import { rotateSession, sessionExists } from "@/lib/auth/session";
import { setAuthCookies } from "@/lib/auth/cookies";
import { REFRESH_COOKIE, REFRESH_TTL_SEC } from "@/lib/auth/keys";
import { unauthorized } from "@/lib/auth/guard";
import { getUserByUsername } from "@/lib/auth/users";

async function refreshAndRespond(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) return null;
  const user = await verifyRefreshToken(refreshToken);
  if (!user || !(await sessionExists(user.jti))) return null;
  const dbUser = await getUserByUsername(user.username);
  if (!dbUser) return null;

  const jti = await rotateSession(user.jti, user.username, REFRESH_TTL_SEC);
  const [access, refresh] = await Promise.all([
    createAccessToken(user.username, dbUser.role),
    createRefreshToken(user.username, jti, dbUser.role),
  ]);
  return { access, refresh, username: user.username };
}

export async function POST(req: NextRequest) {
  const result = await refreshAndRespond(req);
  if (!result) return unauthorized();
  const res = NextResponse.json({ ok: true, username: result.username });
  setAuthCookies(res, result.access, result.refresh);
  return res;
}

export async function GET(req: NextRequest) {
  const next = req.nextUrl.searchParams.get("next") || "/admin";
  const result = await refreshAndRespond(req);
  if (!result) return NextResponse.redirect(new URL("/admin/login", req.url));
  const res = NextResponse.redirect(new URL(next, req.url));
  setAuthCookies(res, result.access, result.refresh);
  return res;
}