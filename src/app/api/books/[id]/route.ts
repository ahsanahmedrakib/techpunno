import { NextRequest, NextResponse } from "next/server";
import { getDoc } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const doc = (await getDoc("books", id).catch(() => null)) as
    | (Record<string, unknown> & { isfree?: string })
    | null;
  if (!doc) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  return NextResponse.json({
    id: String(doc.id ?? ""),
    title: String(doc.title ?? ""),
    author: String(doc.author ?? ""),
    description: String(doc.description ?? ""),
    pageCount: Number(doc.pageCount ?? 0),
    isfree: String(doc.isfree ?? ""),
    price: doc.price ? String(doc.price) : undefined,
    cover: doc.cover ? String(doc.cover) : undefined,
  });
}
