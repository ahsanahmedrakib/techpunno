import { NextRequest, NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { getCollection, resolveIdFilter } from "@/lib/db";

const MAX_FEATURED = 2;
const TRUE_VALUES = [true, "true"];

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const rawId = String(body.id ?? "").trim();
    if (!rawId) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const featured =
      body.featured === true || body.featured === "true";

    const coll = await getCollection("news");
    const filter = await resolveIdFilter("news", rawId);
    const doc = (await coll.findOne(filter)) as Record<string, unknown> | null;
    if (!doc) {
      return NextResponse.json(
        { error: "News item not found" },
        { status: 404 },
      );
    }

    const now = new Date().toISOString();

    if (featured) {
      const others = (await coll
        .find({
          _id: { $ne: doc._id as ObjectId },
          featured: { $in: TRUE_VALUES },
          deletedAt: null,
        })
        .sort({ featuredAt: 1, createdAt: 1, _id: 1 })
        .project({ _id: 1 })
        .toArray()) as { _id: ObjectId }[];
      const extra = others.length - (MAX_FEATURED - 1);
      if (extra > 0) {
        const dropIds = others
          .slice(0, extra)
          .map((o) => o._id);
        await coll.updateMany(
          { _id: { $in: dropIds } },
          { $set: { featured: false, updatedAt: now } },
        );
      }
      await coll.updateOne(filter, {
        $set: { featured: true, featuredAt: now, updatedAt: now },
      });
    } else {
      await coll.updateOne(filter, {
        $set: { featured: false, updatedAt: now },
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
