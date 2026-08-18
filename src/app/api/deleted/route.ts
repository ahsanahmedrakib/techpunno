import { NextRequest, NextResponse } from "next/server";
import {
  tables,
  isTableKey,
  tableKeys,
  type TableKey,
  getDeletedDoc,
  listDeletedDocs,
  permanentRemoveDoc,
  restoreDoc,
} from "@/lib/db";
import { deleteImageFiles } from "@/lib/images";
import {
  getAuthUserFromRequest,
  unauthorized,
  forbidden,
} from "@/lib/auth/guard";
import { logAudit, actorOf, recordLabel } from "@/lib/audit";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  if (admin.role === "editor") return forbidden();
  try {
    const tableParam = new URL(req.url).searchParams.get("table") ?? "";
    const keys: TableKey[] =
      tableParam && isTableKey(tableParam)
        ? [tableParam as TableKey]
        : tableKeys;
    const docs: Array<Record<string, unknown>> = [];
    for (const key of keys) {
      const deleted = (await listDeletedDocs(key)) as Record<string, unknown>[];
      for (const d of deleted) docs.push({ ...d, _table: key });
    }
    docs.sort((a, b) => {
      const da = String(a.deletedAt ?? "");
      const db = String(b.deletedAt ?? "");
      return db.localeCompare(da);
    });
    return NextResponse.json({ docs, total: docs.length });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  if (admin.role === "editor") return forbidden();
  try {
    const body = (await req.json()) as { table?: string; id?: string };
    if (!body.table || !isTableKey(body.table) || !body.id) {
      return NextResponse.json({ error: "table and id are required" }, { status: 400 });
    }
    if (tables[body.table].readOnly && !tables[body.table].deletable) {
      return NextResponse.json(
        { error: "This table is read-only" },
        { status: 403 },
      );
    }
    const restored = await restoreDoc(body.table, body.id);
    if (!restored) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    const a = actorOf(admin);
    if (a) {
      const existing = (await getDeletedDoc(body.table, body.id)) as Record<
        string,
        unknown
      > | null;
      const label = existing ? recordLabel(existing) : "";
      await logAudit({
        ...a,
        action: "restore",
        table: body.table,
        recordId: body.id,
        summary: `Restored ${tables[body.table].singular.toLowerCase()}${
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

export async function DELETE(req: NextRequest) {
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  if (admin.role === "editor") return forbidden();
  try {
    const body = (await req.json()) as { table?: string; id?: string };
    if (!body.table || !isTableKey(body.table) || !body.id) {
      return NextResponse.json({ error: "table and id are required" }, { status: 400 });
    }
    if (tables[body.table].readOnly && !tables[body.table].deletable) {
      return NextResponse.json(
        { error: "This table is read-only" },
        { status: 403 },
      );
    }
    const existing = (await getDeletedDoc(
      body.table,
      body.id,
    )) as Record<string, unknown> | null;
    const deleted = await permanentRemoveDoc(body.table, body.id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    if (existing) {
      const imageFields = tables[body.table].fields
        .filter((f) => f.type === "image" || f.type === "images")
        .map((f) => f.name);
      await deleteImageFiles(existing, imageFields);
    }
    const a = actorOf(admin);
    if (a) {
      const label = existing ? recordLabel(existing) : "";
      await logAudit({
        ...a,
        action: "permanent_delete",
        table: body.table,
        recordId: body.id,
        summary: `Permanently deleted ${tables[body.table].singular.toLowerCase()}${
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
