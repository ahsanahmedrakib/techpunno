import { NextRequest, NextResponse } from "next/server";
import {
  tables,
  createDoc,
  getCollection,
  isTableKey,
  listDocs,
  pagedDocs,
  projectDoc,
  HttpError,
  type TableKey,
} from "@/lib/db";
import { getAuthUserFromRequest, unauthorized } from "@/lib/auth/guard";
import { logAudit, actorOf, recordLabel } from "@/lib/audit";

export const dynamic = "force-dynamic";

async function singleTableResponse(
  table: TableKey,
  withPage: boolean,
  admin: boolean,
) {
  const docs = await listDocs(table);
  const doc = (docs[0] ?? tables[table].seed[0] ?? {}) as Record<
    string,
    unknown
  >;
  const visible = admin ? doc : projectDoc(table, doc);
  if (!withPage) {
    return withAuthMode(NextResponse.json([visible]), admin);
  }
  return withAuthMode(
    NextResponse.json({
      docs: [visible],
      total: docs.length,
      page: 1,
      pageSize: 10,
      totalPages: docs.length > 0 ? 1 : 0,
    }),
    admin,
  );
}

function withAuthMode(res: NextResponse, admin: boolean): NextResponse {
  res.headers.set("x-auth-mode", admin ? "admin" : "public");
  return res;
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ table: string }> },
) {
  const { table } = await params;
  if (!isTableKey(table)) {
    return NextResponse.json({ error: "Unknown table" }, { status: 404 });
  }
  const admin =
    req.headers.get("x-request-mode") === "admin" &&
    !!(await getAuthUserFromRequest(req));
  try {
    const url = new URL(req.url);

    if (!admin && !tables[table].publicFields) {
      return unauthorized();
    }

    if (tables[table].single) {
      return singleTableResponse(table, url.searchParams.has("page"), admin);
    }

    if (!url.searchParams.has("page")) {
      const docs = (await listDocs(table)) as Record<string, unknown>[];
      const visible = admin ? docs : docs.map((d) => projectDoc(table, d));
      return withAuthMode(NextResponse.json(visible), admin);
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
    if (!admin) {
      result.docs = result.docs.map((d) =>
        projectDoc(table, d as Record<string, unknown>),
      ) as typeof result.docs;
    }
    return withAuthMode(NextResponse.json(result), admin);
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
  const admin = await getAuthUserFromRequest(req);
  if (!tables[table].publicCreate) {
    if (tables[table].readOnly) {
      return NextResponse.json(
        { error: "This table is read-only" },
        { status: 403 },
      );
    }
    if (!admin) return unauthorized();
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
    if (admin) {
      const a = actorOf(admin);
      if (a) {
        await logAudit({
          ...a,
          action: "create",
          table,
          recordId: String(doc && typeof doc === "object" ? (doc as Record<string, unknown>).id : "") || undefined,
          summary: `Created ${tables[table].singular.toLowerCase()}${recordLabel(doc as Record<string, unknown>) ? ` "${recordLabel(doc as Record<string, unknown>)}"` : ""}`,
        });
      }
    }
    return NextResponse.json(doc, { status: 201 });
  } catch (error) {
    const status = error instanceof HttpError ? error.status : 500;
    const message = error instanceof Error ? error.message : "Database error";
    return NextResponse.json({ error: message }, { status });
  }
}