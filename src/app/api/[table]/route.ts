import { NextRequest, NextResponse } from "next/server";
import {
  tables,
  createDoc,
  getCollection,
  isTableKey,
  listDocs,
  pagedDocs,
  HttpError,
  type TableKey,
} from "@/lib/db";

export const dynamic = "force-dynamic";

async function singleTableResponse(table: TableKey, withPage: boolean) {
  const docs = await listDocs(table);
  const doc = docs[0] ?? tables[table].seed[0] ?? {};
  if (!withPage) {
    return NextResponse.json([doc]);
  }
  return NextResponse.json({
    docs: [doc],
    total: docs.length,
    page: 1,
    pageSize: 10,
    totalPages: docs.length > 0 ? 1 : 0,
  });
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> },
) {
  const { table } = await params;
  if (!isTableKey(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 404 });
  }
  try {
    const url = new URL(req.url);

    if (tables[table].single) {
      return singleTableResponse(table, url.searchParams.has("page"));
    }

    if (!url.searchParams.has("page")) {
      const docs = await listDocs(table);
      return NextResponse.json(docs);
    }

    const page = Math.max(1, Number(url.searchParams.get("page")) || 1);
    const pageSize = Math.min(
      100,
      Math.max(1, Number(url.searchParams.get("pageSize")) || 10),
    );
    const search = url.searchParams.get("search") ?? "";
    const filterField = url.searchParams.get("filterField") ?? undefined;
    const filterValue = url.searchParams.get("filterValue") ?? undefined;
    let filters: { field: string; value: string | string[] }[] | undefined;
    const rawFilters = url.searchParams.get("filters");
    if (rawFilters) {
      try {
        const parsed = JSON.parse(rawFilters) as unknown;
        if (Array.isArray(parsed)) {
          filters = (
            parsed as { field?: string; value?: string | string[] }[]
          ).filter(
            (f) => f && f.field && f.value,
          ) as { field: string; value: string | string[] }[];
        }
      } catch {
        filters = undefined;
      }
    }

    let sortLast: { field: string; values: string[] } | undefined;
    const rawSortLast = url.searchParams.get("sortLast");
    if (rawSortLast) {
      try {
        const parsed = JSON.parse(rawSortLast) as unknown;
        if (
          parsed &&
          typeof parsed === "object" &&
          typeof (parsed as { field?: unknown }).field === "string" &&
          Array.isArray((parsed as { values?: unknown }).values) &&
          (parsed as { values: unknown[] }).values.every(
            (v) => typeof v === "string",
          )
        ) {
          sortLast = parsed as { field: string; values: string[] };
        }
      } catch {
        sortLast = undefined;
      }
    }

    const result = await pagedDocs(table, {
      page,
      pageSize,
      search,
      filterField,
      filterValue,
      filters,
      sortLast,
    });
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> },
) {
  const { table } = await params;
  if (!isTableKey(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 404 });
  }
  if (tables[table].readOnly) {
    return NextResponse.json(
      { error: "This table is read-only" },
      { status: 403 },
    );
  }
  if (tables[table].single) {
    const coll = await getCollection(table);
    const count = await coll.countDocuments();
    if (count > 0) {
      return NextResponse.json(
        {
          error:
            "Configuration already exists. Save your changes to update it instead of creating a new one.",
        },
        { status: 409 },
      );
    }
  }
  try {
    const body = await req.json();
    const doc = await createDoc(table, body);
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status });
  }
}
