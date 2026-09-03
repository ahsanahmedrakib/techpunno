import { NextRequest, NextResponse } from "next/server";
import { registerPublicUser } from "@/lib/auth/publicAuth";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const user = await registerPublicUser({
      name: body.name,
      email: body.email,
      mobile: body.mobile,
      password: body.password,
    });
    return NextResponse.json(
      { ok: true, user: { id: user.id, name: user.name } },
      { status: 201 },
    );
  } catch (err) {
    const status = err instanceof Error && "status" in err ? (err as { status: number }).status : 500;
    const message = err instanceof Error ? err.message : "Registration failed";
    return NextResponse.json({ error: message }, { status });
  }
}
