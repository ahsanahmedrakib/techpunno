import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir, access } from "fs/promises";
import path from "path";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const destDir = path
      .basename(((formData.get("dir") as string) || "uploads").trim())
      .replace(/[^a-zA-Z0-9_-]/g, "");

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const originalName = path.basename(file.name);
    const ext = path.extname(originalName);
    const baseName = path.basename(originalName, ext);

    const uploadDir = path.join(process.cwd(), "public", "images", destDir);
    await mkdir(uploadDir, { recursive: true });

    let filename = originalName;
    let counter = 1;
    while (true) {
      const filePath = path.join(uploadDir, filename);
      try {
        await access(filePath);
      } catch {
        await writeFile(filePath, buffer);
        const publicPath = `/images/${destDir}/${filename}`;
        return NextResponse.json({ path: publicPath });
      }
      filename = `${baseName}-${counter}${ext}`;
      counter++;
    }
  } catch (err) {
    const message = err instanceof Error ? err.message : "Upload failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
