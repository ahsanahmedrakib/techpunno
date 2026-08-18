import { NextResponse } from "next/server";

export async function GET() {
  const b64 = process.env.ADMIN_RSA_PUBLIC_KEY ?? "";
  const publicKey = b64
    ? Buffer.from(b64, "base64").toString("utf8")
    : "";
  return NextResponse.json({ publicKey });
}