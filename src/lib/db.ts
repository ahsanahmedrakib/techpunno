import { Collection, ObjectId } from "mongodb";
import { getDbName, getMongoClient } from "@/lib/mongodb";
import { uniqueIdWithPhoneNumber } from "@/lib/utils";
import {
  tables,
  isTableKey,
  tableKeys,
  type TableKey,
  type TableConfig,
  type FieldDef,
  type FieldType,
} from "@/lib/tables";

export {
  tables,
  isTableKey,
  tableKeys,
  type TableKey,
  type TableConfig,
  type FieldDef,
  type FieldType,
};

function slugify(text: string): string {
  const base = text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-")
    .replace(/[^\p{L}\p{M}\p{N}-]+/gu, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "");
  return base || "untitled";
}

function hasSlugField(key: TableKey): boolean {
  return tables[key].fields.some((f) => f.name === "slug");
}

async function slugExists(
  key: TableKey,
  slug: string,
  excludeId?: string,
): Promise<boolean> {
  for (const tableKey of tableKeys) {
    const coll = await getCollection(tableKey);
    const filter: Record<string, unknown> = { slug };
    if (tableKey === key && excludeId) {
      if (/^[0-9a-fA-F]{24}$/.test(excludeId)) {
        filter._id = { $ne: new ObjectId(excludeId) };
      } else {
        filter._id = { $ne: excludeId };
      }
    }
    const exists = await coll.findOne(filter, { projection: { _id: 1 } });
    if (exists) return true;
  }
  return false;
}

async function generateUniqueSlug(
  key: TableKey,
  base: string,
  excludeId?: string,
): Promise<string> {
  let slug = base;
  let counter = 1;
  while (true) {
    if (!(await slugExists(key, slug, excludeId))) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
}

export function mapDoc<T>(doc: Record<string, unknown>): T {
  const mongoId = String(doc._id);
  const { ...rest } = doc;
  const id = rest.id !== undefined ? rest.id : mongoId;
  return { ...rest, id, _id: mongoId } as unknown as T;
}

export async function getCollection(
  key: TableKey,
): Promise<Collection<Record<string, unknown>>> {
  const client = await getMongoClient();
  const db = client.db(getDbName());
  return db.collection<Record<string, unknown>>(key);
}

const ACTIVE_FILTER = { deletedAt: null };
const DELETED_FILTER = { deletedAt: { $ne: null } };

export async function listDocs(key: TableKey): Promise<unknown[]> {
  const coll = await getCollection(key);
  const docs = (await coll
    .find(ACTIVE_FILTER)
    .sort({ _id: 1 })
    .toArray()) as Record<string, unknown>[];
  return docs.map((d) => mapDoc(d));
}

export interface PagedResult<T> {
  docs: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

function escapeRegex(text: string): string {
  return text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function buildSearchFilter(
  key: TableKey,
  search: string,
): Record<string, unknown> {
  if (!search) return {};
  const searchable = tables[key].fields
    .filter(
      (f) =>
        f.type === "text" || f.type === "textarea" || f.type === "list",
    )
    .map((f) => f.name);
  if (searchable.length === 0) return {};
  const regex = escapeRegex(search);
  return {
    $or: searchable.map((name) => ({
      [name]: { $regex: regex, $options: "i" },
    })),
  };
}

export async function pagedDocs<T = unknown>(
  key: TableKey,
  options: {
    page: number;
    pageSize: number;
    search?: string;
    filterField?: string;
    filterValue?: string;
  },
): Promise<PagedResult<T>> {
  const coll = await getCollection(key);
  const filter = buildSearchFilter(key, options.search ?? "");
  filter.deletedAt = null;
  if (options.filterField && options.filterValue) {
    filter[options.filterField] = options.filterValue;
  }
  const total = await coll.countDocuments(filter);
  const docs = (await coll
    .find(filter)
    .sort({ createdAt: -1, _id: -1 })
    .skip((options.page - 1) * options.pageSize)
    .limit(options.pageSize)
    .toArray()) as Record<string, unknown>[];
  return {
    docs: docs.map((d) => mapDoc<T>(d)),
    total,
    page: options.page,
    pageSize: options.pageSize,
    totalPages: Math.ceil(total / options.pageSize),
  };
}

export async function getDoc(key: TableKey, rawId: string): Promise<unknown | null> {
  const coll = await getCollection(key);
  const baseFilter = { ...(await resolveIdFilter(key, rawId)), deletedAt: null };
  let doc = (await coll.findOne(baseFilter)) as Record<
    string,
    unknown
  > | null;
  if (!doc) {
    const numeric = Number(rawId);
    const asNumber =
      Number.isFinite(numeric) && String(numeric) === rawId.trim()
        ? numeric
        : null;
    if (asNumber !== null) {
      doc = (await coll.findOne({ id: asNumber, deletedAt: null })) as Record<
        string,
        unknown
      > | null;
    }
    if (!doc) {
      doc = (await coll.findOne({ id: rawId, deletedAt: null })) as Record<
        string,
        unknown
      > | null;
    }
  }
  return doc ? mapDoc(doc) : null;
}

async function resolveIdFilter(
  key: TableKey,
  rawId: string,
): Promise<Record<string, unknown>> {
  if (/^[0-9a-fA-F]{24}$/.test(rawId)) {
    try {
      const oid = new ObjectId(rawId);
      const coll = await getCollection(key);
      const exists = await coll.findOne({ _id: oid }, { projection: { _id: 1 } });
      if (exists) return { _id: oid };
    } catch {
      /* fall through */
    }
  }
  const coll = await getCollection(key);
  const numeric = Number(rawId);
  if (Number.isFinite(numeric) && String(numeric) === rawId.trim()) {
    const exists = await coll.findOne({ id: numeric }, { projection: { _id: 1 } });
    if (exists) return { id: numeric };
  }
  const exists = await coll.findOne({ id: rawId }, { projection: { _id: 1 } });
  if (exists) return { id: rawId };
  return { _id: rawId };
}

export class HttpError extends Error {
  status: number;

  constructor(message: string, status = 500) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

function pickFields(
  key: TableKey,
  body: Record<string, unknown>,
): Record<string, unknown> {
  const col = tables[key];
  const picked: Record<string, unknown> = {};
  for (const field of col.fields) {
    if (field.type === "readonly") continue;
    if (body[field.name] !== undefined) {
      picked[field.name] = body[field.name];
    }
  }
  return picked;
}

export async function createDoc(
  key: TableKey,
  body: Record<string, unknown>,
): Promise<unknown> {
  const coll = await getCollection(key);
  const doc = pickFields(key, body);
  if (key === "volunteers" && typeof body.mobile === "string" && body.mobile.trim()) {
    const mobile = body.mobile.trim();
    const exists = await coll.findOne({ mobile }, { projection: { _id: 1 } });
    if (exists) {
      throw new HttpError(
        "A volunteer with this mobile number is already registered.",
        409,
      );
    }
    doc.volunteerId = `TP-${
      body.membershipType === "Ambassador" ? "AM" : "VL"
    }-${uniqueIdWithPhoneNumber(mobile)}`;
  }
  const now = new Date().toISOString();
  doc.createdAt = now;
  doc.updatedAt = now;
  const statusField = tables[key].statusField ?? "status";
  if (tables[key].defaultStatus && doc[statusField] === undefined) {
    doc[statusField] = tables[key].defaultStatus;
  }
  if (hasSlugField(key)) {
    const title = String(doc.title || doc.name || "");
    const base = slugify(title);
    doc.slug = await generateUniqueSlug(key, base);
  }
  const result = await coll.insertOne(doc as never);
  doc._id = result.insertedId;
  return mapDoc(doc);
}

export async function updateDoc(
  key: TableKey,
  rawId: string,
  body: Record<string, unknown>,
): Promise<unknown | null> {
  const coll = await getCollection(key);
  const doc = pickFields(key, body);
  doc.updatedAt = new Date().toISOString();
  if (hasSlugField(key) && (doc.title || doc.name)) {
    const title = String(doc.title || doc.name || "");
    const base = slugify(title);
    const filter = await resolveIdFilter(key, rawId);
    const existing = await coll.findOne(filter, { projection: { _id: 1 } });
    doc.slug = await generateUniqueSlug(
      key,
      base,
      existing ? String(existing._id) : undefined,
    );
  }
  const filter = await resolveIdFilter(key, rawId);
  const result = await coll.findOneAndUpdate(
    filter,
    { $set: doc },
    { returnDocument: "after" },
  );
  if (!result) return null;
  const mapped = result as Record<string, unknown>;
  return mapDoc(mapped);
}

export async function removeDoc(
  key: TableKey,
  rawId: string,
): Promise<boolean> {
  const coll = await getCollection(key);
  const filter = await resolveIdFilter(key, rawId);
  const now = new Date().toISOString();
  const result = await coll.updateOne(filter, {
    $set: { deletedAt: now, updatedAt: now },
  });
  return (result.matchedCount ?? 0) > 0;
}

export async function restoreDoc(
  key: TableKey,
  rawId: string,
): Promise<boolean> {
  const coll = await getCollection(key);
  const filter = await resolveIdFilter(key, rawId);
  const result = await coll.updateOne(filter, {
    $set: { deletedAt: null, updatedAt: new Date().toISOString() },
  });
  return (result.matchedCount ?? 0) > 0;
}

export async function permanentRemoveDoc(
  key: TableKey,
  rawId: string,
): Promise<boolean> {
  const coll = await getCollection(key);
  const filter = await resolveIdFilter(key, rawId);
  const result = await coll.deleteOne(filter);
  return (result.deletedCount ?? 0) > 0;
}

export async function getDeletedDoc(
  key: TableKey,
  rawId: string,
): Promise<unknown | null> {
  const coll = await getCollection(key);
  const filter = {
    ...(await resolveIdFilter(key, rawId)),
    ...DELETED_FILTER,
  };
  const doc = (await coll.findOne(filter)) as Record<string, unknown> | null;
  return doc ? mapDoc(doc) : null;
}

export async function listDeletedDocs(key: TableKey): Promise<unknown[]> {
  const coll = await getCollection(key);
  const docs = (await coll
    .find(DELETED_FILTER)
    .sort({ deletedAt: -1 })
    .toArray()) as Record<string, unknown>[];
  return docs.map((d) => mapDoc(d));
}

export async function getDocBySlug(
  key: TableKey,
  slug: string,
): Promise<unknown | null> {
  const coll = await getCollection(key);
  const doc = (await coll.findOne({
    slug,
    deletedAt: null,
  })) as Record<string, unknown> | null;
  return doc ? mapDoc(doc) : null;
}
