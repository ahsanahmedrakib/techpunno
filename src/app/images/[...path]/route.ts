import { access, readFile } from "fs/promises";
import path from "path";
import { NextRequest, NextResponse } from "next/server";
import { imageRoot } from "@/lib/storage";

export const dynamic = "force-dynamic";

const MIME: Record<string, string> = {
  jpg: "image/jpeg",
  jpeg: "image/jpeg",
  png: "image/png",
  gif: "image/gif",
  webp: "image/webp",
  avif: "image/avif",
  svg: "image/svg+xml",
  ico: "image/x-icon",
  bmp: "image/bmp",
};

type Params = Promise<{ path: string[] }>;

export async function GET(_req: NextRequest, { params }: { params: Params }) {
  const { path: segments } = await params;
  const filePath = path.join(imageRoot(), ...segments);
  if (!filePath.startsWith(path.resolve(imageRoot()))) {
    return new NextResponse("Not found", { status: 404 });
  }
  try {
    await access(filePath);
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
  const data = await readFile(filePath);
  const ext = path.extname(filePath).slice(1).toLowerCase();
  return new NextResponse(data, {
    headers: {
      "Content-Type": MIME[ext] ?? "application/octet-stream",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
