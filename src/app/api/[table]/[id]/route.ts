import { NextRequest, NextResponse } from "next/server";
import {
  tables,
  getDoc,
  isTableKey,
  removeDoc,
  updateDoc,
} from "@/lib/db";

export const dynamic = "force-dynamic";

type Params = Promise<{ table: string; id: string }>;

export async function GET(
  _req: NextRequest,
  { params }: { params: Params },
) {
  const { table, id } = await params;
  if (!isTableKey(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 404 });
  }
  try {
    const doc = await getDoc(table, id);
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(doc);
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
  if (tables[table].readOnly) {
    return NextResponse.json(
      { error: "This table is read-only" },
      { status: 403 },
    );
  }
  try {
    const body = await req.json();
    const doc = await updateDoc(table, id, body);
    if (!doc) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(doc);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Params },
) {
  const { table, id } = await params;
  if (!isTableKey(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 404 });
  }
  if (tables[table].readOnly) {
    return NextResponse.json(
      { error: "This table is read-only" },
      { status: 403 },
    );
  }
  try {
    const deleted = await removeDoc(table, id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
