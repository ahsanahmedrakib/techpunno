import { access, mkdir, unlink, writeFile } from "fs/promises";
import path from "path";

export function imageRoot(): string {
  if (process.env.VERCEL) {
    return path.join("/tmp", "images");
  }
  return path.join(process.cwd(), "public", "images");
}

function sanitizeDir(dir: string): string {
  return path.basename(dir).replace(/[^a-zA-Z0-9_-]/g, "") || "uploads";
}

export async function uploadImage(opts: {
  buffer: Buffer;
  filename: string;
  dir?: string;
  contentType?: string;
}): Promise<string> {
  const dir = sanitizeDir(opts.dir ?? "uploads");
  const ext = path.extname(opts.filename);
  const base = path.basename(opts.filename, ext);

  const uploadDir = path.join(imageRoot(), dir);
  await mkdir(uploadDir, { recursive: true });

  let filename = opts.filename;
  let counter = 1;
  while (true) {
    const filePath = path.join(uploadDir, filename);
    try {
      await access(filePath);
    } catch {
      await writeFile(filePath, opts.buffer);
      return `/images/${dir}/${filename}`;
    }
    filename = `${base}-${counter}${ext}`;
    counter++;
  }
}

export async function deleteImage(urlOrPath: string): Promise<void> {
  if (!urlOrPath || !urlOrPath.startsWith("/images/")) return;
  const filePath = path.join(imageRoot(), urlOrPath.slice("/images/".length));
  try {
    await unlink(filePath);
  } catch {
    // File may already be missing or shared; ignore.
  }
}
