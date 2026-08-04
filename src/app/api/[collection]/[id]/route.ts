import { NextRequest, NextResponse } from "next/server";
import {
  collections,
  getDoc,
  isCollectionKey,
  removeDoc,
  updateDoc,
} from "@/lib/db";

export const dynamic = "force-dynamic";

type Params = Promise<{ collection: string; id: string }>;

export async function GET(
  _req: NextRequest,
  { params }: { params: Params },
) {
  const { collection, id } = await params;
  if (!isCollectionKey(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  try {
    const doc = await getDoc(collection, id);
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
  const { collection, id } = await params;
  if (!isCollectionKey(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  if (collections[collection].readOnly) {
    return NextResponse.json(
      { error: "This collection is read-only" },
      { status: 403 },
    );
  }
  try {
    const body = await req.json();
    const doc = await updateDoc(collection, id, body);
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
  const { collection, id } = await params;
  if (!isCollectionKey(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  if (collections[collection].readOnly) {
    return NextResponse.json(
      { error: "This collection is read-only" },
      { status: 403 },
    );
  }
  try {
    const deleted = await removeDoc(collection, id);
    if (!deleted) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json({ ok: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
