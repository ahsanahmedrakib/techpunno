import { NextRequest, NextResponse } from "next/server";
import {
  PUBLIC_REFRESH_COOKIE,
  clearPublicAuthCookies,
  deletePublicSession,
  verifyPublicRefreshToken,
} from "@/lib/auth/publicAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(PUBLIC_REFRESH_COOKIE)?.value;
  if (refreshToken) {
    const parsed = await verifyPublicRefreshToken(refreshToken);
    if (parsed) await deletePublicSession(parsed.jti);
  }
  const res = NextResponse.json({ ok: true });
  clearPublicAuthCookies(res);
  return res;
}
