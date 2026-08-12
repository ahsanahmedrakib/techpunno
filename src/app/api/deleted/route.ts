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

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
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
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
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
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
