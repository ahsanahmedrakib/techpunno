import { generateKeyPairSync, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";

function printUsage() {
  console.log(`
Usage:
  node scripts/auth-setup.mjs <admin-username> <admin-password>

Generates a bcrypt password hash, an RSA-2048 keypair and JWT secrets.
Paste the printed lines into your .env file.
`);
}

const [, , rawUser, rawPass] = process.argv;
if (!rawUser || !rawPass) {
  printUsage();
  process.exit(1);
}

const username = rawUser.trim();
const password = rawPass;

const hash = await bcrypt.hash(password, 12);

const { publicKey, privateKey } = generateKeyPairSync("rsa", {
  modulusLength: 2048,
  publicKeyEncoding: { type: "spki", format: "pem" },
  privateKeyEncoding: { type: "pkcs8", format: "pem" },
});

const accessSecret = randomBytes(32).toString("base64");
const refreshSecret = randomBytes(32).toString("base64");

const publicKeyB64 = Buffer.from(publicKey, "utf8").toString("base64");
const privateKeyB64 = Buffer.from(privateKey, "utf8").toString("base64");
const hashB64 = Buffer.from(hash, "utf8").toString("base64");

const lines = [
  `ADMIN_USERNAME=${username}`,
  `ADMIN_PASSWORD_HASH=${hashB64}`,
  `# ADMIN_PASSWORD=${password}   (fallback plaintext only if hash is removed)`,
  `JWT_ACCESS_SECRET=${accessSecret}`,
  `JWT_REFRESH_SECRET=${refreshSecret}`,
  `ADMIN_RSA_PUBLIC_KEY=${publicKeyB64}`,
  `ADMIN_RSA_PRIVATE_KEY=${privateKeyB64}`,
];

console.log("\n# --- Paste these lines into your .env file ---\n");
console.log(lines.join("\n"));
console.log("\n# -------------------------------------------\n");