import { unlink } from "fs/promises";
import path from "path";

function localFilePath(publicPath: string): string | null {
  if (!publicPath.startsWith("/images/")) return null;
  return path.join(process.cwd(), "public", publicPath);
}

export async function deleteImageFiles(
  doc: Record<string, unknown>,
  imageFields: string[],
): Promise<void> {
  for (const field of imageFields) {
    const value = doc[field];
    if (typeof value !== "string" || !value) continue;
    const filePath = localFilePath(value);
    if (!filePath) continue;
    try {
      await unlink(filePath);
    } catch {
      // File may already be missing or shared; ignore.
    }
  }
}
