import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest, unauthorized } from "@/lib/auth/guard";

export async function GET(req: NextRequest) {
  const user = await getAuthUserFromRequest(req);
  if (!user) return unauthorized();
  return NextResponse.json(user);
}