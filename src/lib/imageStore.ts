import { getDbName, getMongoClient } from "@/lib/mongodb";

interface ImageDoc {
  key: string;
  folder: string;
  resourceId: string;
  data: string;
  mime: string;
  createdAt: Date;
}

async function getCollection() {
  const client = await getMongoClient();
  return client.db(getDbName()).collection<ImageDoc>("images");
}

function sanitizeSegment(part: string): string {
  return part.replace(/[^a-zA-Z0-9_-]/g, "").slice(0, 60);
}

export async function saveImageToDB(
  base64Data: string,
  folderName: string,
  id: string | number,
): Promise<string> {
  const matches = base64Data.match(/^data:([^;]+);base64,(.+)$/);
  if (!matches) {
    throw new Error("Invalid base64 image data");
  }
  const mime = matches[1];
  const data = matches[2];

  const folder = sanitizeSegment(folderName) || "uploads";
  const unique = `${sanitizeSegment(String(id))}_${Date.now()}_${Math.random()
    .toString(36)
    .slice(2, 8)}`;
  const key = `${folder}/${unique}`;

  const coll = await getCollection();
  await coll.insertOne({
    key,
    folder,
    resourceId: String(id),
    data,
    mime,
    createdAt: new Date(),
  });

  return `/api/image/${key}`;
}

export async function deleteImageFromDB(imageUrl: string): Promise<void> {
  const key = imageUrl.replace(/^\/api\/image\//, "").replace(/\/+$/, "");
  if (!key) return;
  const coll = await getCollection();
  await coll.deleteOne({ key });
}