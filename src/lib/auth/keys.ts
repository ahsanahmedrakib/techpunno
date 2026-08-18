export const ACCESS_COOKIE = "tp_at";
export const REFRESH_COOKIE = "tp_rt";

export const ACCESS_TTL_SEC = 60 * 60;
export const REFRESH_TTL_SEC = 30 * 24 * 60 * 60;

function base64ToBytes(value: string): Uint8Array {
  const clean = value.replace(/[\r\n\s]/g, "");
  if (typeof atob === "function") {
    const bin = atob(clean);
    const out = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
    return out;
  }
  return new Uint8Array(Buffer.from(clean, "base64"));
}

function requireBytes(envValue: string | undefined, name: string): Uint8Array {
  if (!envValue) {
    throw new Error(
      `${name} is not defined. Run "node scripts/auth-setup.mjs" to generate one.`,
    );
  }
  const bytes = base64ToBytes(envValue);
  if (bytes.length !== 32) {
    throw new Error(`${name} must decode to exactly 32 bytes (base64).`);
  }
  return bytes;
}

let accessKeyPromise: Promise<Uint8Array> | null = null;
let refreshKeyPromise: Promise<Uint8Array> | null = null;

export function getAccessKey(): Promise<Uint8Array> {
  accessKeyPromise ??= Promise.resolve(
    requireBytes(process.env.JWT_ACCESS_SECRET, "JWT_ACCESS_SECRET"),
  );
  return accessKeyPromise;
}

export function getRefreshKey(): Promise<Uint8Array> {
  refreshKeyPromise ??= Promise.resolve(
    requireBytes(process.env.JWT_REFRESH_SECRET, "JWT_REFRESH_SECRET"),
  );
  return refreshKeyPromise;
}