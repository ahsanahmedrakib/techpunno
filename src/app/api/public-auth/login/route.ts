import { NextRequest, NextResponse } from "next/server";
import {
  createPublicAccessToken,
  createPublicRefreshToken,
  createPublicSession,
  setPublicAuthCookies,
  verifyPublicUserCredentials,
} from "@/lib/auth/publicAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const identifier = String(body.identifier ?? "").trim();
    const password = String(body.password ?? "");
    if (!identifier || !password) {
      return NextResponse.json(
        { error: "Mobile/Email and password are required" },
        { status: 400 },
      );
    }
    const user = await verifyPublicUserCredentials(identifier, password);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 },
      );
    }
    const jti = crypto.randomUUID();
    await createPublicSession(user.id, jti);
    const access = await createPublicAccessToken(user.id);
    const refresh = await createPublicRefreshToken(user.id, jti);
    const res = NextResponse.json({
      ok: true,
      user: { id: user.id, name: user.name, email: user.email, mobile: user.mobile },
    });
    setPublicAuthCookies(res, access, refresh);
    return res;
  } catch (err) {
    const message =
      err instanceof Error ? err.message : "Login failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
