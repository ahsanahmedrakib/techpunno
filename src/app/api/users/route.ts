import { NextRequest, NextResponse } from "next/server";
import {
  ensureSuperAdmin,
  listUsers,
  createUser,
  publicUser,
  type UserRole,
} from "@/lib/auth/users";
import { getAuthUserFromRequest, unauthorized, forbidden } from "@/lib/auth/guard";
import { HttpError } from "@/lib/db";
import { logAudit, actorOf } from "@/lib/audit";

export const dynamic = "force-dynamic";

function canManageUsers(role: UserRole): boolean {
  return role === "superadmin" || role === "admin";
}

export async function GET(req: NextRequest) {
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  if (!canManageUsers(admin.role)) return forbidden();
  try {
    await ensureSuperAdmin();
    const users = await listUsers();
    return NextResponse.json(users.map((u) => publicUser(u)));
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  if (!canManageUsers(admin.role)) return forbidden();
  try {
    const body = (await req.json()) as {
      username?: string;
      password?: string;
      role?: UserRole;
    };
    if (typeof body.username !== "string" || typeof body.password !== "string") {
      return NextResponse.json(
        { error: "username and password are required" },
        { status: 400 },
      );
    }
    const doc = await createUser({
      username: body.username,
      password: body.password,
      role: body.role ?? "editor",
    });
    const a = actorOf(admin);
    if (a) {
      await logAudit({
        ...a,
        action: "user_create",
        table: "users",
        recordId: String(doc.id),
        summary: `Created user "${doc.username}" (${doc.role})`,
      });
    }
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status });
  }
}