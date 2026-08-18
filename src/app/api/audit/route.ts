import { NextRequest, NextResponse } from "next/server";
import { getAuthUserFromRequest, unauthorized, forbidden } from "@/lib/auth/guard";
import { getMongoClient, getDbName } from "@/lib/mongodb";
import type { AuditEntry } from "@/lib/audit";

export const dynamic = "force-dynamic";

const PAGE_SIZE = 25;

export async function GET(req: NextRequest) {
  const admin = await getAuthUserFromRequest(req);
  if (!admin) return unauthorized();
  if (admin.role === "editor") return forbidden();

  try {
    const url = new URL(req.url);
    const page = Math.max(1, parseInt(url.searchParams.get("page") ?? "1", 10) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, parseInt(url.searchParams.get("pageSize") ?? String(PAGE_SIZE), 10) || PAGE_SIZE),
    );
    const table = url.searchParams.get("table")?.trim() ?? "";
    const action = url.searchParams.get("action")?.trim() ?? "";
    const actor = url.searchParams.get("actor")?.trim() ?? "";
    const search = url.searchParams.get("search")?.trim() ?? "";

    const filter: Record<string, unknown> = {};
    if (table) filter.table = table;
    if (action) filter.action = action;
    if (actor) filter.actor = actor;
    if (search) {
      filter.$or = [
        { summary: { $regex: search, $options: "i" } },
        { actor: { $regex: search, $options: "i" } },
        { recordId: { $regex: search, $options: "i" } },
      ];
    }

    const client = await getMongoClient();
    const coll = client
      .db(getDbName())
      .collection<AuditEntry>("auditlogs");

    const total = await coll.countDocuments(filter);
    const docs = (await coll
      .find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * pageSize)
      .limit(pageSize)
      .toArray()) as unknown as AuditEntry[];

    return NextResponse.json({
      docs,
      total,
      page,
      pageSize,
      totalPages: Math.max(1, Math.ceil(total / pageSize)),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}