import { getDbName, getMongoClient } from "@/lib/mongodb";

async function progressCollection() {
  const client = await getMongoClient();
  return client
    .db(getDbName())
    .collection<Record<string, unknown>>("readingprogress");
}

export async function saveReadingProgress(input: {
  userId: string;
  bookId: string;
  bookTitle: string;
  page: number;
  totalPages: number;
  fullName: string;
}): Promise<void> {
  const coll = await progressCollection();
  const now = new Date().toISOString();
  const progress =
    input.totalPages > 0
      ? Math.min(100, Math.round((input.page / input.totalPages) * 100))
      : 0;
  await coll.updateOne(
    { userId: input.userId, bookId: input.bookId },
    {
      $set: {
        userId: input.userId,
        bookId: input.bookId,
        bookTitle: input.bookTitle,
        fullName: input.fullName,
        page: input.page,
        totalPages: input.totalPages,
        progress,
        updatedAt: now,
        deletedAt: null,
      },
      $setOnInsert: { createdAt: now },
    },
    { upsert: true },
  );
}

export async function getReadingProgress(
  userId: string,
  bookId: string,
): Promise<{ page: number; progress: number } | null> {
  const coll = await progressCollection();
  const doc = (await coll.findOne({
    userId,
    bookId,
    deletedAt: null,
  })) as Record<string, unknown> | null;
  if (!doc) return null;
  return {
    page: Number(doc.page ?? 1),
    progress: Number(doc.progress ?? 0),
  };
}

export async function listReadingProgress(
  userId: string,
): Promise<
  { bookId: string; bookTitle: string; page: number; progress: number }[]
> {
  const coll = await progressCollection();
  const docs = (await coll
    .find({ userId, deletedAt: null })
    .sort({ updatedAt: -1 })
    .toArray()) as Record<string, unknown>[];
  return docs.map((d) => ({
    bookId: String(d.bookId ?? ""),
    bookTitle: String(d.bookTitle ?? ""),
    page: Number(d.page ?? 1),
    progress: Number(d.progress ?? 0),
  }));
}
