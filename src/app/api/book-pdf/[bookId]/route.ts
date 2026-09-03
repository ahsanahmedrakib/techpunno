import { NextRequest, NextResponse } from "next/server";
import { getDoc } from "@/lib/db";
import { getBookFile } from "@/lib/bookfiles";
import { getAuthUserFromRequest } from "@/lib/auth/guard";
import { getPublicUserFromRequest } from "@/lib/auth/publicAuth";
import { hasBookAccess } from "@/lib/books";

export const dynamic = "force-dynamic";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ bookId: string }> },
) {
  const { bookId } = await params;

  if (new URL(req.url).searchParams.get("meta") === "1") {
    const admin = await getAuthUserFromRequest(req);
    if (!admin) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const existing = await getBookFile(bookId);
    return NextResponse.json({
      exists: Boolean(existing),
      size: existing ? existing.size : 0,
    });
  }

  const book = (await getDoc("books", bookId)) as
    | (Record<string, unknown> & { isfree?: string })
    | null;
  if (!book) {
    return NextResponse.json({ error: "Book not found" }, { status: 404 });
  }
  const isFree = String(book.isfree ?? "").toLowerCase() === "free";

  let userId = "";
  if (!isFree) {
    const user = await getPublicUserFromRequest(req);
    if (!user) {
      return NextResponse.json(
        { error: "You must sign in to read this book" },
        { status: 401 },
      );
    }
    userId = user.id;
    const access = await hasBookAccess(userId, bookId);
    if (!access) {
      return NextResponse.json(
        { error: "You have not purchased this book" },
        { status: 403 },
      );
    }
  }

  const file = await getBookFile(bookId);
  if (!file) {
    return NextResponse.json(
      { error: "Book content not available yet" },
      { status: 404 },
    );
  }

  const buffer = Buffer.from(file.data, "base64");
  const download = new URL(req.url).searchParams.get("dl") === "1";
  const headers: Record<string, string> = {
    "Content-Type": "application/pdf",
    "Content-Length": String(buffer.length),
    "Content-Disposition": download && isFree
      ? 'attachment; filename="book.pdf"'
      : 'inline; filename="book.pdf"',
    "Cache-Control": "no-store",
    "Pragma": "no-cache",
    "X-Content-Type-Options": "nosniff",
  };

  if (!isFree) {
    headers["Permissions-Policy"] =
      "download=(), fullscreen=*, xr-spatial-tracking=()";
  }

  return new NextResponse(buffer, { status: 200, headers });
}
