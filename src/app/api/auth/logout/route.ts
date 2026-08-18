import { NextRequest, NextResponse } from "next/server";
import { verifyRefreshToken } from "@/lib/auth/tokens";
import { deleteSession } from "@/lib/auth/session";
import { clearAuthCookies } from "@/lib/auth/cookies";
import { REFRESH_COOKIE } from "@/lib/auth/keys";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  const refreshToken = req.cookies.get(REFRESH_COOKIE)?.value;
  if (refreshToken) {
    const user = await verifyRefreshToken(refreshToken);
    if (user) {
      await deleteSession(user.jti);
      await logAudit({
        actor: user.username,
        actorRole: user.role,
        action: "logout",
        table: "auth",
        summary: "Signed out",
      });
    }
  }
  const res = NextResponse.json({ ok: true });
  clearAuthCookies(res);
  return res;
}