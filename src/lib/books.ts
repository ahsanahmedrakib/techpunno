import { getMongoClient, getDbName } from "@/lib/mongodb";

export interface AccessRecord {
  userId: string;
  bookId: string;
  bookTitle: string;
  status: string;
  fullName?: string;
  mobile?: string;
  updatedAt: string;
}

async function accessCollection() {
  const client = await getMongoClient();
  return client
    .db(getDbName())
    .collection<Record<string, unknown>>("bookaccess");
}

export async function hasBookAccess(
  userId: string,
  bookId: string,
): Promise<boolean> {
  const coll = await accessCollection();
  const doc = await coll.findOne({
    userId,
    bookId,
    status: "approved",
    deletedAt: null,
  });
  return !!doc;
}

export async function grantBookAccess(input: {
  userId: string;
  bookId: string;
  bookTitle: string;
  fullName?: string;
  mobile?: string;
  status?: string;
}): Promise<void> {
  const coll = await accessCollection();
  const now = new Date().toISOString();
  await coll.updateOne(
    { userId: input.userId, bookId: input.bookId },
    {
      $set: {
        userId: input.userId,
        bookId: input.bookId,
        bookTitle: input.bookTitle,
        fullName: input.fullName ?? "",
        mobile: input.mobile ?? "",
        status: input.status ?? "approved",
        updatedAt: now,
        deletedAt: null,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );
}

export async function revokeBookAccess(
  userId: string,
  bookId: string,
): Promise<void> {
  const coll = await accessCollection();
  const now = new Date().toISOString();
  await coll.updateOne(
    { userId, bookId },
    { $set: { status: "rejected", updatedAt: now } },
  );
}

export async function listUserBooks(
  userId: string,
): Promise<AccessRecord[]> {
  const coll = await accessCollection();
  const docs = (await coll
    .find({ userId, status: "approved", deletedAt: null })
    .sort({ updatedAt: -1 })
    .toArray()) as Record<string, unknown>[];
  return docs.map((d) => ({
    userId: String(d.userId ?? ""),
    bookId: String(d.bookId ?? ""),
    bookTitle: String(d.bookTitle ?? ""),
    status: String(d.status ?? ""),
    fullName: String(d.fullName ?? ""),
    mobile: String(d.mobile ?? ""),
    updatedAt: String(d.updatedAt ?? ""),
  }));
}

export async function getUserPurchase(
  userId: string,
  bookId: string,
  bookTitle?: string,
): Promise<{ fullName: string; mobile: string } | null> {
  const coll = await accessCollection();
  const filter: Record<string, unknown> = {
    userId,
    status: "approved",
    deletedAt: null,
  };
  if (bookId) filter.bookId = bookId;
  else if (bookTitle) filter.bookTitle = bookTitle;
  const doc = (await coll.findOne(filter)) as Record<string, unknown> | null;
  if (!doc) return null;
  return {
    fullName: String(doc.fullName ?? ""),
    mobile: String(doc.mobile ?? ""),
  };
}
