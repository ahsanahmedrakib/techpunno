export function safeImage(src?: string | null): string {
  if (!src) return "";
  if (src.startsWith("__pending:")) return "";
  if (src.startsWith("/") || src.startsWith("data:")) return src;
  if (/^https?:\/\//i.test(src)) return src;
  return "";
}

export function safeImages(src?: string | string[] | null): string[] {
  const list = Array.isArray(src)
    ? src
    : typeof src === "string" && src
      ? [src]
      : [];
  return list.map(safeImage).filter(Boolean);
}

interface ImageFields {
  cardImage?: string;
  image?: string;
  images?: string[] | string;
}

export function firstImage(item?: ImageFields | null): string {
  return safeImage(item?.cardImage) || safeImage(item?.image);
}

export function singleImageList(item?: ImageFields | null): string[] {
  const multi = safeImages(item?.images);
  if (multi.length > 0) return multi;
  const single = safeImage(item?.cardImage);
  return single ? [single] : [];
}