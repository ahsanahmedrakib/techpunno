import { NextResponse } from "next/server";
import { getCollection, collectionKeys } from "@/lib/db";
import { collections } from "@/lib/collections";

function slugify(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
}

async function generateUniqueSlug(
  coll: { findOne: (filter: Record<string, unknown>, opts?: { projection?: Record<string, number> }) => Promise<Record<string, unknown> | null> },
  base: string,
): Promise<string> {
  let slug = base;
  let counter = 1;
  while (true) {
    const exists = await coll.findOne({ slug }, { projection: { _id: 1 } });
    if (!exists) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
}

export async function POST() {
  try {
    for (const key of collectionKeys) {
      const coll = await getCollection(key);
      const count = await coll.countDocuments();
      if (count === 0) {
        const col = collections[key];
        if (col.seed.length > 0) {
          const hasSlug = col.fields.some((f) => f.name === "slug");
          const docs = col.seed.map((s) => {
            const doc = { ...s };
            if (hasSlug) {
              const title = String(doc.title || doc.name || "");
              (doc as Record<string, unknown>).slug = slugify(title);
            }
            return doc;
          });
          if (hasSlug) {
            const seen = new Map<string, number>();
            for (const doc of docs) {
              const rec = doc as Record<string, unknown>;
              const base = String(rec.slug || "");
              const count = seen.get(base) ?? 0;
              if (count > 0) {
                rec.slug = `${base}-${count}`;
              }
              seen.set(base, count + 1);
            }
          }
          await coll.insertMany(docs as never[]);
        }
      }
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Seed failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    for (const key of collectionKeys) {
      const coll = await getCollection(key);
      await coll.deleteMany({});
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Drop failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
