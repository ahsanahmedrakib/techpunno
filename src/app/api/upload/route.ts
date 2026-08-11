import { NextRequest, NextResponse } from "next/server";
import { uploadImage } from "@/lib/storage";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const dir = ((formData.get("dir") as string) || "uploads").trim();

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const path = await uploadImage({
      buffer,
      filename: file.name,
      dir,
      contentType: file.type,
    });
    return NextResponse.json({ path });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
