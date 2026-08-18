import { NextRequest, NextResponse } from "next/server";
import {
  tables,
  getDoc,
  isTableKey,
  removeDoc,
  updateDoc,
  projectDoc,
} from "@/lib/db";
import {
  getAuthUserFromRequest,
  unauthorized,
  forbidden,
} from "@/lib/auth/guard";
import { logAudit, actorOf, recordLabel, type AuditAction } from "@/lib/audit";

export const dynamic = "force-dynamic";

type Params = Promise<{ table: string; id: string }>;

export async function GET(
  req: NextRequest,
  { params }: { params: Params },
) {
  const { table, id } = await params;
  if (!isTableKey(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 404 });
  }
  const admin =
    req.headers.get("x-request-mode") === "admin" &&
    !!(await getAuthUserFromRequest(req));
  try {
    const doc = (await getDoc(table, id)) as Record<string, unknown> | null;
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (!admin) {
      if (!tables[table].publicFields) return unauthorized();
      const res = NextResponse.json(projectDoc(table, doc));
      res.headers.set("x-auth-mode", "public");
      return res;
    }
    const res = NextResponse.json(doc);
    res.headers.set("x-auth-mode", "admin");
    return res;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PUT(
  req: NextRequest,
  { params }: { params: Params },
) {
  const { table, id } = await params;
  if (!isTableKey(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 404 });
  }
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  if (tables[table].readOnly && !tables[table].editableFields) {
    return NextResponse.json(
      { error: "This table is read-only" },
      { status: 403 },
    );
  }
  try {
    const body = await req.json();
    let payload = body;
    if (tables[table].editableFields) {
      const allowed = new Set(tables[table].editableFields);
      payload = Object.fromEntries(
        Object.entries(body).filter(([k]) => allowed.has(k)),
      );
    }
    const existing = (await getDoc(table, id)) as Record<string, unknown> | null;
    const doc = await updateDoc(table, id, payload);
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const a = actorOf(admin);
    if (a) {
      const mapped = doc as Record<string, unknown>;
      const statusField = tables[table].statusField;
      const oldStatus = existing && statusField
        ? String(existing[statusField] ?? "")
        : "";
      const newStatus = statusField ? String(mapped[statusField] ?? "") : "";
      let action: AuditAction = "update";
      if (statusField && oldStatus && oldStatus !== newStatus) {
        if (newStatus === "approved") action = "approve";
        else if (newStatus === "rejected") action = "reject";
        else if (newStatus === "resigned") action = "resign";
        else action = "status_change";
      }
      const label = recordLabel(mapped) || recordLabel(existing ?? {});
      const subject = tables[table].singular.toLowerCase();
      const summary =
        action === "update"
          ? `Updated ${subject}${label ? ` "${label}"` : ""}`
          : `Marked ${subject}${label ? ` "${label}"` : ""} as ${newStatus}`;
      await logAudit({
        ...a,
        action,
        table,
        recordId: String(mapped.id ?? id),
        summary,
        changes:
          oldStatus && oldStatus !== newStatus
            ? { fromStatus: oldStatus, toStatus: newStatus }
            : undefined,
      });
    }
    return NextResponse.json(doc);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Params },
) {
  const { table, id } = await params;
  if (!isTableKey(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 404 });
  }
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  if (admin.role === "editor") {
    return forbidden();
  }
  if (tables[table].readOnly && !tables[table].deletable) {
    return NextResponse.json(
      { error: "This table is read-only" },
      { status: 403 },
    );
  }
  try {
    const existing = (await getDoc(table, id)) as Record<string, unknown> | null;
    const deleted = await removeDoc(table, id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const a = actorOf(admin);
    if (a) {
      const label = existing ? recordLabel(existing) : "";
      await logAudit({
        ...a,
        action: "delete",
        table,
        recordId: String(existing?.id ?? id),
        summary: `Deleted ${tables[table].singular.toLowerCase()}${
          label ? ` "${label}"` : ""
        }`,
      });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}