import { getDbName, getMongoClient } from "@/lib/mongodb";
import { HttpError } from "@/lib/db";

interface BookFileDoc {
  bookId: string;
  mime: string;
  data: string;
  size: number;
  createdAt: Date;
}

async function collection() {
  const client = await getMongoClient();
  return client.db(getDbName()).collection<BookFileDoc>("bookfiles");
}

export async function saveBookFile(input: {
  bookId: string;
  mime: string;
  buffer: Buffer;
}): Promise<void> {
  const coll = await collection();
  await coll.deleteOne({ bookId: input.bookId });
  await coll.insertOne({
    bookId: input.bookId,
    mime: input.mime,
    data: input.buffer.toString("base64"),
    size: input.buffer.length,
    createdAt: new Date(),
  });
}

export async function getBookFile(
  bookId: string,
): Promise<{ mime: string; data: string; size: number } | null> {
  const coll = await collection();
  const doc = (await coll.findOne({ bookId })) as BookFileDoc | null;
  if (!doc) return null;
  return { mime: doc.mime, data: doc.data, size: doc.size };
}

export async function deleteBookFile(bookId: string): Promise<void> {
  const coll = await collection();
  await coll.deleteOne({ bookId });
}

export async function bookFileExists(bookId: string): Promise<boolean> {
  const coll = await collection();
  const doc = await coll.findOne({ bookId }, { projection: { _id: 1 } });
  return !!doc;
}

export async function validatePdf(buffer: Buffer): Promise<void> {
  if (buffer.length > 100 * 1024 * 1024) {
    throw new HttpError("PDF file is too large (max 100MB)", 400);
  }
  const head = buffer.subarray(0, 1024).toString("latin1");
  if (!/%PDF-/.test(head)) {
    throw new HttpError("Uploaded file is not a valid PDF", 400);
  }
}
