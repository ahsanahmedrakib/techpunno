import { Collection, ObjectId } from "mongodb";
import { getMongoClient, getDbName } from "@/lib/mongodb";
import type { PublicUser } from "./publicAuth";

async function collection(): Promise<Collection<Record<string, unknown>>> {
  const client = await getMongoClient();
  return client
    .db(getDbName())
    .collection<Record<string, unknown>>("publicusers");
}

export async function listPublicUsers(): Promise<PublicUser[]> {
  const coll = await collection();
  const docs = (await coll
    .find({ deletedAt: null })
    .sort({ createdAt: -1 })
    .toArray()) as Record<string, unknown>[];
  return docs.map((d) => ({
    _id: d._id as ObjectId,
    id: String(d.id ?? d._id ?? ""),
    name: String(d.name ?? ""),
    email: String(d.email ?? ""),
    mobile: String(d.mobile ?? ""),
    passwordHash: String(d.passwordHash ?? ""),
    createdAt: String(d.createdAt ?? ""),
    updatedAt: String(d.updatedAt ?? ""),
    deletedAt: (d.deletedAt as string | null) ?? null,
  }));
}

export async function deletePublicUser(id: string): Promise<boolean> {
  const coll = await collection();
  const now = new Date().toISOString();
  let res;
  try {
    res = await coll.updateOne(
      { _id: new ObjectId(id), deletedAt: null },
      { $set: { deletedAt: now, updatedAt: now } },
    );
  } catch {
    res = await coll.updateOne(
      { id, deletedAt: null },
      { $set: { deletedAt: now, updatedAt: now } },
    );
  }
  return (res.matchedCount ?? 0) > 0;
}
