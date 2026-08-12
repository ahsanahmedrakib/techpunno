import { NextRequest, NextResponse } from "next/server";
import { saveImage } from "@/lib/images";

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
    const mime = file.type || "image/png";
    const dataUrl = `data:${mime};base64,${buffer.toString("base64")}`;
    const id = `u_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;

    const path = await saveImage(dataUrl, dir, id);
    return NextResponse.json({ path });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}