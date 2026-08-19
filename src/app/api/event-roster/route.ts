import { NextRequest, NextResponse } from "next/server";
import { getCollection } from "@/lib/db";

export const dynamic = "force-dynamic";

export interface RosterRow {
  fullName: string;
  className: string;
  institution: string;
  registered: boolean;
  participated: boolean;
}

export async function GET(req: NextRequest) {
  const eventId = req.nextUrl.searchParams.get("eventId") ?? "";
  if (!eventId) {
    return NextResponse.json({ error: "eventId is required" }, { status: 400 });
  }
  const regColl = await getCollection("eventregistrations");
  const partColl = await getCollection("eventparticipants");

  const [regs, parts] = await Promise.all([
    regColl
      .find({ eventId, deletedAt: null })
      .toArray() as Promise<Record<string, unknown>[]>,
    partColl
      .find({ eventId, deletedAt: null })
      .toArray() as Promise<Record<string, unknown>[]>,
  ]);

  const byMobile = new Map<string, RosterRow>();

  const apply = (
    docs: Record<string, unknown>[],
    mark: "registered" | "participated",
    allowedStatus: string[],
  ) => {
    for (const d of docs) {
      const key = String(d.mobile ?? "").trim();
      if (!key) continue;
      const status = String(d.status ?? "");
      if (allowedStatus.length > 0 && !allowedStatus.includes(status)) {
        continue;
      }
      const row =
        byMobile.get(key) ??
        ({
          fullName: String(d.fullName ?? ""),
          className: String(d.className ?? ""),
          institution: String(d.institution ?? ""),
          registered: false,
          participated: false,
        } satisfies RosterRow);
      row[mark] = true;
      byMobile.set(key, row);
    }
  };

  apply(regs, "registered", ["pending", "approved"]);
  apply(parts, "participated", ["approved"]);

  const rows = Array.from(byMobile.values()).sort((a, b) =>
    a.fullName.localeCompare(b.fullName),
  );

  return NextResponse.json(rows);
}