export function safeImage(src?: string | null): string {
  if (!src) return "";
  if (src.startsWith("__pending:")) return "";
  if (src.startsWith("/") || src.startsWith("data:")) return src;
  if (/^https?:\/\//i.test(src)) return src;
  return "";
}
