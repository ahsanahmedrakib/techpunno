import { NextRequest, NextResponse } from "next/server";
import { getPublicUserFromRequest } from "@/lib/auth/publicAuth";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const user = await getPublicUserFromRequest(req);
  if (!user) {
    return NextResponse.json({ user: null }, { status: 200 });
  }
  return NextResponse.json({ user });
}
