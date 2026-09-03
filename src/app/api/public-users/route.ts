import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest, unauthorized } from "@/lib/auth/guard";
import { deletePublicUser, listPublicUsers } from "@/lib/auth/publicAuthAdmin";

export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  try {
    const users = await listPublicUsers();
    return NextResponse.json(
      users.map((u) => ({
        id: u.id,
        name: u.name,
        email: u.email,
        mobile: u.mobile,
        createdAt: u.createdAt,
      })),
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  try {
    const { id } = (await req.json()) as { id?: string };
    if (!id) {
      return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }
    const ok = await deletePublicUser(id);
    return NextResponse.json({ ok });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Error" },
      { status: 500 },
    );
  }
}
