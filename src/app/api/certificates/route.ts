import { NextRequest, NextResponse } from "next/server";
import { randomBytes } from "crypto";
import { getCollection } from "@/lib/db";

export const dynamic = "force-dynamic";

const MIN_PASS_PERCENTAGE = 80;

function mapDoc<T>(doc: Record<string, unknown>): T {
  const mongoId = String(doc._id);
  const id = doc.id !== undefined ? doc.id : mongoId;
  return { ...doc, id, _id: mongoId } as unknown as T;
}

async function generateCertificateId(
  coll: Awaited<ReturnType<typeof getCollection>>,
): Promise<string> {
  const year = new Date().getFullYear();
  for (let attempt = 0; attempt < 5; attempt++) {
    const code = randomBytes(4).toString("hex").toUpperCase();
    const certificateId = `TP-${year}-${code}`;
    const exists = await coll.findOne(
      { certificateId },
      { projection: { _id: 1 } },
    );
    if (!exists) return certificateId;
  }
  throw new Error("Failed to generate a unique certificate ID");
}

export async function GET() {
  try {
    const coll = await getCollection("certificates");
    const docs = (await coll.find({}).sort({ createdAt: -1 }).toArray()) as Record<
      string,
      unknown
    >[];
    return NextResponse.json(docs.map((d) => mapDoc(d)));
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
    const certificateId = await generateCertificateId(coll);

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
