import { NextRequest, NextResponse } from "next/server";
import { getPublicUserFromRequest } from "@/lib/auth/publicAuth";
import { saveReadingProgress } from "@/lib/readingProgress";
import { getDoc } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const user = await getPublicUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "You must sign in" }, { status: 401 });
  }
  const body = await req.json();
  const bookId = String(body.bookId ?? "").trim();
  const page = Math.max(1, Number(body.page) || 1);
  if (!bookId) {
    return NextResponse.json({ error: "Book is required" }, { status: 400 });
  }
  const book = (await getDoc("books", bookId)) as
    | (Record<string, unknown> & { title?: string; pageCount?: number })
    | null;
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  await saveReadingProgress({
    userId: user.id,
    bookId,
    bookTitle: String(book.title ?? ""),
    page,
    totalPages: Number(book.pageCount) || 0,
    fullName: user.name,
  });
  return NextResponse.json({ ok: true });
}
