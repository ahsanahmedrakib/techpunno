import { Collection, ObjectId } from "mongodb";
import { getDbName, getMongoClient } from "@/lib/mongodb";
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

function hasSlugField(key: TableKey): boolean {
  return tables[key].fields.some((f) => f.name === "slug");
}

async function generateUniqueSlug(
  coll: Collection<Record<string, unknown>>,
  base: string,
  excludeId?: string,
): Promise<string> {
  let slug = base;
  let counter = 1;
  while (true) {
    const filter: Record<string, unknown> = { slug };
    if (excludeId) {
      if (/^[0-9a-fA-F]{24}$/.test(excludeId)) {
        filter._id = { $ne: new ObjectId(excludeId) };
      } else {
        filter._id = { $ne: excludeId };
      }
    }
    const exists = await coll.findOne(filter, { projection: { _id: 1 } });
    if (!exists) return slug;
    slug = `${base}-${counter}`;
    counter++;
  }
}

function mapDoc<T>(doc: Record<string, unknown>): T {
  const mongoId = String(doc._id);
  const { _id, ...rest } = doc;
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

export async function listDocs(key: TableKey): Promise<unknown[]> {
  const coll = await getCollection(key);
  const docs = (await coll.find({}).sort({ _id: 1 }).toArray()) as Record<
    string,
    unknown
  >[];
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
  options: { page: number; pageSize: number; search?: string },
): Promise<PagedResult<T>> {
  const coll = await getCollection(key);
  const filter = buildSearchFilter(key, options.search ?? "");
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
  let doc = (await coll.findOne(await resolveIdFilter(key, rawId))) as Record<
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
      doc = (await coll.findOne({ id: asNumber })) as Record<
        string,
        unknown
      > | null;
    }
    if (!doc) {
      doc = (await coll.findOne({ id: rawId })) as Record<
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
  const now = new Date().toISOString();
  doc.createdAt = now;
  doc.updatedAt = now;
  if (hasSlugField(key)) {
    const title = String(doc.title || doc.name || "");
    const base = slugify(title);
    doc.slug = await generateUniqueSlug(coll, base);
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
      coll,
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
  const result = await coll.deleteOne(filter);
  return (result.deletedCount ?? 0) > 0;
}

export async function getDocBySlug(
  key: TableKey,
  slug: string,
): Promise<unknown | null> {
  const coll = await getCollection(key);
  const doc = (await coll.findOne({ slug })) as Record<string, unknown> | null;
  return doc ? mapDoc(doc) : null;
}
