import { deleteImage } from "@/lib/storage";

export async function deleteImageFiles(
  doc: Record<string, unknown>,
  imageFields: string[],
): Promise<void> {
  for (const field of imageFields) {
    const value = doc[field];
    if (typeof value !== "string" || !value) continue;
    await deleteImage(value);
  }
}
