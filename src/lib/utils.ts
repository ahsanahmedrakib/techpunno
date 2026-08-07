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

export function uniqueIdWithPhoneNumber(phone: string): string {
  const map = "ABCDEFGHIJ";

  const encoded = phone
    .replace(/\D/g, "")
    .replace(/[0-9]/g, (digit) => map[Number(digit)]);

  const year = new Date().getFullYear().toString().slice(-2);

  return `${year}-${encoded}`;
}
