import { webcrypto } from "crypto";

const subtle = webcrypto.subtle;

function pemToArrayBuffer(pem: string, label: string): ArrayBuffer {
  const body = pem
    .replace(`-----BEGIN ${label}-----`, "")
    .replace(`-----END ${label}-----`, "")
    .replace(/\\+n/g, "")
    .replace(/[\r\n\s]/g, "");
  const bin = Buffer.from(body, "base64");
  const out = new Uint8Array(bin.length);
  out.set(bin);
  return out.buffer;
}

async function getPrivateKey(): Promise<CryptoKey> {
  const b64 = process.env.ADMIN_RSA_PRIVATE_KEY;
  if (!b64) {
    throw new Error(
      "ADMIN_RSA_PRIVATE_KEY is not defined. Run scripts/auth-setup.mjs.",
    );
  }
  const pem = Buffer.from(b64, "base64").toString("utf8");
  return subtle.importKey(
    "pkcs8",
    pemToArrayBuffer(pem, "PRIVATE KEY"),
    { name: "RSA-OAEP", hash: "SHA-256" },
    false,
    ["decrypt"],
  );
}

export async function decryptCredentials(
  encryptedBase64: string,
): Promise<string> {
  const key = await getPrivateKey();
  const bytes = new Uint8Array(Buffer.from(encryptedBase64, "base64"));
  const decrypted = await subtle.decrypt(
    { name: "RSA-OAEP" },
    key,
    bytes.buffer,
  );
  return new TextDecoder().decode(decrypted);
}