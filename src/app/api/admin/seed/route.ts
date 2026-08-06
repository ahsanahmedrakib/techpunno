import { NextResponse } from "next/server";
import { getCollection, tableKeys } from "@/lib/db";
import { tables } from "@/lib/tables";

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

export async function POST() {
  try {
    for (const key of tableKeys) {
      const coll = await getCollection(key);
      const count = await coll.countDocuments();
      if (count === 0) {
        const col = tables[key];
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
    for (const key of tableKeys) {
      const coll = await getCollection(key);
      await coll.deleteMany({});
    }
    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Drop failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
