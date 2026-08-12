export const EXTENSION_MAP: Record<string, string> = {
  jpeg: "jpg",
  jpg: "jpg",
  png: "png",
  webp: "webp",
  "svg+xml": "svg",
  svg: "svg",
};

export const ALLOWED_MIME_PREFIX = "image/";

export function isAllowedImageType(mimeType: string): boolean {
  if (!mimeType || !mimeType.startsWith(ALLOWED_MIME_PREFIX)) return false;
  const subtype = mimeType.slice(ALLOWED_MIME_PREFIX.length).toLowerCase();
  return subtype in EXTENSION_MAP;
}
