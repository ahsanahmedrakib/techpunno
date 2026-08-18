import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./keys";
import { verifyAccessToken, verifyRefreshToken } from "./tokens";
import { sessionExists } from "./session";
import { getUserByUsername, type AuthUser, type UserRole } from "./users";

export async function getAuthUserFromRequest(
  req: NextRequest,
): Promise<AuthUser | null> {
  const token = req.cookies.get(ACCESS_COOKIE)?.value;
  if (!token) return null;
  const user = await verifyAccessToken(token);
  if (!user) return null;
  const dbUser = await getUserByUsername(user.username);
  if (!dbUser) return null;
  return { username: dbUser.username, role: dbUser.role };
}

export function unauthorized(): NextResponse {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function forbidden(): NextResponse {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function requireAdmin(): Promise<AuthUser> {
  const store = await cookies();
  const access = store.get(ACCESS_COOKIE)?.value;
  if (access) {
    const user = await verifyAccessToken(access);
    if (user) {
      const dbUser = await getUserByUsername(user.username);
      if (dbUser) return { username: dbUser.username, role: dbUser.role };
    }
  }
  const refresh = store.get(REFRESH_COOKIE)?.value;
  if (refresh) {
    const user = await verifyRefreshToken(refresh);
    if (user && (await sessionExists(user.jti))) {
      redirect("/api/auth/refresh?next=/admin");
    }
  }
  redirect("/admin/login");
}

export async function requireRole(roles: UserRole[]): Promise<AuthUser> {
  const user = await requireAdmin();
  if (!roles.includes(user.role)) {
    redirect("/admin");
  }
  return user;
}