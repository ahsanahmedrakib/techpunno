import { NextRequest, NextResponse } from "next/server";
import { decryptCredentials } from "@/lib/auth/credentials";
import { verifyAdminCredentials } from "@/lib/auth/admin";
import { markLastLogin } from "@/lib/auth/users";
import { createAccessToken, createRefreshToken } from "@/lib/auth/tokens";
import { createSession } from "@/lib/auth/session";
import { setAuthCookies } from "@/lib/auth/cookies";
import { REFRESH_TTL_SEC } from "@/lib/auth/keys";
import { unauthorized } from "@/lib/auth/guard";
import { logAudit } from "@/lib/audit";

export async function POST(req: NextRequest) {
  await new Promise((r) => setTimeout(r, 350));

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return unauthorized();
  }

  const encryptedPassword = body.password;
  const username = typeof body.username === "string" ? body.username : "";
  if (
    typeof encryptedPassword !== "string" ||
    !encryptedPassword ||
    !username
  ) {
    return unauthorized();
  }

  let password: string;
  try {
    password = await decryptCredentials(encryptedPassword);
  } catch {
    return unauthorized();
  }

  const user = await verifyAdminCredentials(username, password);
  if (!user) return unauthorized();

  await markLastLogin(username);

  const jti = crypto.randomUUID();
  const [access, refresh] = await Promise.all([
    createAccessToken(username, user.role),
    createRefreshToken(username, jti, user.role),
  ]);
  await createSession(username, jti, REFRESH_TTL_SEC);

  await logAudit({
    actor: username,
    actorRole: user.role,
    action: "login",
    table: "auth",
    summary: `Signed in with role ${user.role}`,
  });

  const res = NextResponse.json({ ok: true, username, role: user.role });
  setAuthCookies(res, access, refresh);
  return res;
}