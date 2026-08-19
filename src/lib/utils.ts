const AVATAR_COLORS = [
  "bg-rose-500",
  "bg-orange-500",
  "bg-amber-500",
  "bg-lime-600",
  "bg-emerald-500",
  "bg-teal-500",
  "bg-cyan-600",
  "bg-sky-500",
  "bg-blue-500",
  "bg-indigo-500",
  "bg-violet-500",
  "bg-purple-500",
  "bg-fuchsia-500",
  "bg-pink-500",
];

export function avatarColor(name: string): string {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  }
  return AVATAR_COLORS[hash % AVATAR_COLORS.length];
}

export function formatDateAndTime(dateString: string): string {
  const date = new Date(dateString);

  const day = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);

  const month = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    timeZone: "Asia/Dhaka",
  }).format(date);

  const year = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);

  const time = new Intl.DateTimeFormat("en-GB", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "Asia/Dhaka",
  }).format(date);

  return `${day} ${month}, ${year} - ${time.toUpperCase()}`;
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString);

  const day = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);

  const month = new Intl.DateTimeFormat("en-GB", {
    month: "long",
    timeZone: "Asia/Dhaka",
  }).format(date);

  const year = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);

  return `${day} ${month}, ${year}`;
}

export function getDateParts(dateString: string): {
  day: string;
  month: string;
  year: string;
} {
  const date = new Date(dateString);
  if (Number.isNaN(date.getTime())) {
    const [year, month, day] = dateString.split("-");
    return { day: day ?? "", month: month ?? "", year: year ?? "" };
  }
  const day = new Intl.DateTimeFormat("en-GB", {
    day: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
  const month = new Intl.DateTimeFormat("en-GB", {
    month: "short",
    timeZone: "Asia/Dhaka",
  }).format(date);
  const year = new Intl.DateTimeFormat("en-GB", {
    year: "numeric",
    timeZone: "Asia/Dhaka",
  }).format(date);
  return { day, month, year };
}

export function uniqueIdWithPhoneNumber(phone: string): string {
  const map = "ABCDEFGHIJ";

  const encoded = phone
    .replace(/\D/g, "")
    .replace(/[0-9]/g, (digit) => map[Number(digit)]);

  const year = new Date().getFullYear().toString().slice(-2);

  return `${year}-${encoded}`;
}

export function safeUrl(url?: string | null): string {
  if (!url) return "";
  const trimmed = url.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  return "";
}

export function scrollToField(fieldName: string): void {
  if (typeof document === "undefined") return;
  const el =
    document.querySelector<HTMLElement>(`[data-field="${fieldName}"]`) ??
    document.querySelector<HTMLElement>(`[name="${fieldName}"]`);
  if (!el) return;
  el.scrollIntoView({ behavior: "smooth", block: "center" });
  const focusable = el.querySelector<HTMLElement>(
    "input:not([type='file']):not([type='hidden']), select, textarea, button",
  );
  if (focusable) focusable.focus({ preventScroll: true });
}

export function scrollToFirstError(errors: Record<string, unknown>): void {
  const keys = Object.keys(errors);
  if (keys.length === 0) return;
  scrollToField(keys[0]);
}
