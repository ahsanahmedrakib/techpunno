import { NextRequest, NextResponse } from "next/server";
import { getCollection, listDocs, pagedDocs } from "@/lib/db";
import { uniqueIdWithPhoneNumber } from "@/lib/utils";

const MIN_PASS_PERCENTAGE = 80;

function mapDoc<T>(doc: Record<string, unknown>): T {
  const mongoId = String(doc._id);
  const id = doc.id !== undefined ? doc.id : mongoId;
  return { ...doc, id, _id: mongoId } as unknown as T;
}

async function nextCertificateIndex(
  coll: Awaited<ReturnType<typeof getCollection>>,
): Promise<string> {
  const counters = coll.db.collection<{ _id: string; seq: number }>("counters");
  const key = "certificateIndex";
  const existing = await counters.findOne({ _id: key });
  if (!existing) {
    const count = await coll.countDocuments();
    await counters.insertOne({ _id: key, seq: count });
  }
  const updated = await counters.findOneAndUpdate(
    { _id: key },
    { $inc: { seq: 1 } },
    { returnDocument: "after" },
  );
  return String(updated?.seq ?? 1).padStart(3, "0");
}

function generateCertificateId(phone: string, index: string): string {
  const [year, encoded] = uniqueIdWithPhoneNumber(phone).split("-");
  return `TP-${year}-${index}-${encoded}`;
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    if (!url.searchParams.has("page")) {
      const phone = url.searchParams.get("phone");
      const quizTitle = url.searchParams.get("quizTitle");
      if (phone && quizTitle) {
        const coll = await getCollection("certificates");
        const exists = await coll.findOne(
          { phone, quizTitle },
          { projection: { _id: 1 } },
        );
        return NextResponse.json({ taken: !!exists });
      }
      const docs = await listDocs("certificates");
      return NextResponse.json(docs);
    }

    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get("pageSize")) || 10),
    );
    const search = url.searchParams.get("search") ?? "";
    const result = await pagedDocs("certificates", { page, pageSize, search });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const name = typeof body.name === "string" ? body.name.trim() : "";
    const phone = typeof body.phone === "string" ? body.phone.trim() : "";
    const percentage = Number(body.percentage);

    if (!name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }
    if (!phone) {
      return NextResponse.json({ error: "Phone is required" }, { status: 400 });
    }
    if (
      !Number.isFinite(percentage) ||
      percentage < MIN_PASS_PERCENTAGE ||
      percentage > 100
    ) {
      return NextResponse.json(
        { error: "Percentage must be at least 80 and at most 100" },
        { status: 400 },
      );
    }

    const coll = await getCollection("certificates");

    const quizTitle = typeof body.quizTitle === "string" ? body.quizTitle : "";
    const alreadyTaken = await coll.findOne(
      { phone, quizTitle },
      { projection: { _id: 1 } },
    );
    if (alreadyTaken) {
      return NextResponse.json(
        {
          error:
            "You have already taken this quiz. Each phone number can take a quiz only once.",
        },
        { status: 409 },
      );
    }

    const index = await nextCertificateIndex(coll);
    const certificateId = generateCertificateId(phone, index);

    const now = new Date().toISOString();
    const doc: Record<string, unknown> = {
      certificateId,
      name,
      phone,
      percentage,
      score: Number.isFinite(Number(body.score)) ? Number(body.score) : undefined,
      total: Number.isFinite(Number(body.total)) ? Number(body.total) : undefined,
      quizTitle: typeof body.quizTitle === "string" ? body.quizTitle : "",
      date: typeof body.date === "string" ? body.date : "",
      createdAt: now,
      updatedAt: now,
    };
    Object.keys(doc).forEach((key) => {
      if (doc[key] === undefined) delete doc[key];
    });

    const result = await coll.insertOne(doc as never);
    doc._id = result.insertedId;

    return NextResponse.json(mapDoc(doc), { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
