import { NextRequest, NextResponse } from "next/server";
import {
  PUBLIC_REFRESH_COOKIE,
  createPublicAccessToken,
  createPublicRefreshToken,
  getPublicUserById,
  publicSessionExists,
  rotatePublicSession,
  setPublicAuthCookies,
  verifyPublicRefreshToken,
} from "@/lib/auth/publicAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(PUBLIC_REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    return NextResponse.json({ error: "No refresh token" }, { status: 401 });
  }
  const parsed = await verifyPublicRefreshToken(refreshToken);
  if (!parsed || !(await publicSessionExists(parsed.jti))) {
    return NextResponse.json({ error: "Session expired" }, { status: 401 });
  }
  const user = await getPublicUserById(parsed.userId);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 401 });
  }
  const newJti = await rotatePublicSession(parsed.jti, user.id);
  const access = await createPublicAccessToken(user.id);
  const refresh = await createPublicRefreshToken(user.id, newJti);
  const res = NextResponse.json({ ok: true });
  setPublicAuthCookies(res, access, refresh);
  return res;
}
