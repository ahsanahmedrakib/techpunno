import { NextRequest, NextResponse } from "next/server";
import { getDbName, getMongoClient } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const COOKIE_NAME = "tp_visitor";
const COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

interface VisitorDoc {
  _id: string;
  createdAt: string;
}

async function getVisitorsCollection() {
  const client = await getMongoClient();
  return client
    .db(getDbName())
    .collection<VisitorDoc>("visitors");
}

async function countVisitors(): Promise<number> {
  const coll = await getVisitorsCollection();
  return coll.countDocuments();
}

export async function GET() {
  try {
    return NextResponse.json({ total: await countVisitors() });
  } catch {
    return NextResponse.json({ error: "Failed to load visitor count" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const coll = await getVisitorsCollection();

    const existing = req.cookies.get(COOKIE_NAME)?.value;
    let counted = false;
    let visitorId = existing;

    if (!existing) {
      visitorId = crypto.randomUUID();
      await coll.insertOne({
        _id: visitorId,
        createdAt: new Date().toISOString(),
      });
      counted = true;
    }

    const response = NextResponse.json({
      total: await countVisitors(),
      counted,
    });

    if (counted && visitorId) {
      response.cookies.set(COOKIE_NAME, visitorId, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: COOKIE_MAX_AGE,
        path: "/",
      });
    }

    return response;
  } catch {
    return NextResponse.json({ error: "Failed to track visitor" }, { status: 500 });
  }
}
