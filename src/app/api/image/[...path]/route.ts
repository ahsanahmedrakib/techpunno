import { NextResponse } from "next/server";
import { getDbName, getMongoClient } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

type Params = Promise<{ path: string[] }>;

const SAFE_SEGMENT = /^[a-zA-Z0-9_-]+$/;

export async function GET(_req: Request, { params }: { params: Params }) {
  const { path } = await params;
  if (
    path.length === 0 ||
    path.some((segment) => !SAFE_SEGMENT.test(segment))
  ) {
    return new NextResponse("Not found", { status: 404 });
  }

  const key = path.join("/");

  try {
    const client = await getMongoClient();
    const coll = client.db(getDbName()).collection<{
      data: string;
      mime: string;
    }>("images");
    const doc = await coll.findOne({ key });
    if (!doc) {
      return new NextResponse("Not found", { status: 404 });
    }
    const data = Buffer.from(doc.data, "base64");
    return new NextResponse(data, {
      headers: {
        "Content-Type": doc.mime,
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return new NextResponse("Not found", { status: 404 });
  }
}