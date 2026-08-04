import { NextRequest, NextResponse } from "next/server";
import {
  collections,
  createDoc,
  isCollectionKey,
  listDocs,
} from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;
  if (!isCollectionKey(collection)) {
    return NextResponse.json({ error: "Unknown collection" }, { status: 404 });
  }
  try {
    const docs = await listDocs(collection);
    return NextResponse.json(docs);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ collection: string }> },
) {
  const { collection } = await params;
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
    const doc = await createDoc(collection, body);
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
