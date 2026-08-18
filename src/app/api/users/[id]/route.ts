import { NextRequest, NextResponse } from "next/server";
import {
  updateUser,
  deleteUser,
  type UserRole,
} from "@/lib/auth/users";
import { getAuthUserFromRequest, unauthorized, forbidden } from "@/lib/auth/guard";
import { HttpError } from "@/lib/db";
import { logAudit, actorOf } from "@/lib/audit";
import { getUserById } from "@/lib/auth/users";

export const dynamic = "force-dynamic";

type Params = Promise<{ id: string }>;

function canManageUsers(role: UserRole): boolean {
  return role === "superadmin" || role === "admin";
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Params },
) {
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  if (!canManageUsers(admin.role)) return forbidden();
  try {
    const { id } = await params;
    const body = (await req.json()) as {
      username?: string;
      role?: UserRole;
      password?: string;
    };
    const doc = await updateUser(id, {
      username: typeof body.username === "string" ? body.username : undefined,
      role: typeof body.role === "string" ? body.role : undefined,
      password: typeof body.password === "string" ? body.password : undefined,
    });
    const a = actorOf(admin);
    if (a) {
      const changed: string[] = [];
      if (body.password) changed.push("password");
      if (typeof body.username === "string") changed.push("username");
      if (typeof body.role === "string") changed.push("role");
      await logAudit({
        ...a,
        action: "user_update",
        table: "users",
        recordId: String(doc.id),
        summary: `Updated ${changed.join(", ")} for user "${doc.username}"`,
      });
    }
    return NextResponse.json(doc);
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params },
) {
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  if (!canManageUsers(admin.role)) return forbidden();
  try {
    const { id } = await params;
    const existing = await getUserById(id);
    const deleted = await deleteUser(id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const a = actorOf(admin);
    if (a) {
      await logAudit({
        ...a,
        action: "user_delete",
        table: "users",
        recordId: id,
        summary: `Deleted user "${existing?.username ?? id}"`,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status });
  }
}