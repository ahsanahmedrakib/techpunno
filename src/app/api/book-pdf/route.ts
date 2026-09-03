import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest, unauthorized } from "@/lib/auth/guard";
import { saveBookFile, validatePdf } from "@/lib/bookfiles";
import { getDoc } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  try {
    const formData = await req.formData();
    const bookId = String(formData.get("bookId") ?? "").trim();
    const file = formData.get("file") as File | null;
    if (!bookId) {
      return NextResponse.json({ error: "Book ID is required" }, { status: 400 });
    }
    const doc = await getDoc("books", bookId);
    if (!doc) {
      return NextResponse.json({ error: "Book not found" }, { status: 404 });
    }
    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }
    const buffer = Buffer.from(await file.arrayBuffer());
    await validatePdf(buffer);
    await saveBookFile({
      bookId,
      mime: file.type || "application/pdf",
      buffer,
    });
    return NextResponse.json({ ok: true });
  } catch (err) {
    const status =
      err instanceof Error && "status" in err
        ? (err as { status: number }).status
        : 500;
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Upload failed" },
      { status },
    );
  }
}
