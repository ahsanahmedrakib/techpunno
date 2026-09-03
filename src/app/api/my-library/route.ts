import { NextRequest, NextResponse } from "next/server";
import { getPublicUserFromRequest } from "@/lib/auth/publicAuth";
import { listUserBooks } from "@/lib/books";
import { listReadingProgress } from "@/lib/readingProgress";
import { listDocs } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getPublicUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ error: "You must sign in" }, { status: 401 });
  }
  const [access, progress, books] = await Promise.all([
    listUserBooks(user.id),
    listReadingProgress(user.id),
    listDocs("books").catch(() => []),
  ]);

  const bookMap = new Map<string, Record<string, unknown>>();
  for (const b of books as Record<string, unknown>[]) {
    bookMap.set(String(b.id ?? ""), b);
    bookMap.set(String(b.title ?? ""), b);
  }

  const library = access.map((a) => {
    const book = bookMap.get(a.bookId) ?? bookMap.get(a.bookTitle);
    const prog = progress.find((p) => p.bookId === a.bookId);
    return {
      bookId: a.bookId,
      bookTitle: a.bookTitle,
      cover: String((book as Record<string, unknown> | undefined)?.cover ?? ""),
      author: String(
        (book as Record<string, unknown> | undefined)?.author ?? "",
      ),
      pageCount: Number(
        (book as Record<string, unknown> | undefined)?.pageCount ?? 0,
      ),
      progress: prog?.progress ?? 0,
      lastPage: prog?.page ?? 1,
    };
  });

  return NextResponse.json({ library, user: { name: user.name } });
}
