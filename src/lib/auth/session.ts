import type { Collection } from "mongodb";
import { getMongoClient, getDbName } from "@/lib/mongodb";

interface AuthSession {
  jti: string;
  username: string;
  expiresAt: Date;
  createdAt: Date;
}

async function collection(): Promise<Collection<AuthSession>> {
  const client = await getMongoClient();
  return client
    .db(getDbName())
    .collection<AuthSession>("authsessions");
}

export async function createSession(
  username: string,
  jti: string,
  ttlSec: number,
): Promise<void> {
  await (
    await collection()
  ).insertOne({
    jti,
    username,
    expiresAt: new Date(Date.now() + ttlSec * 1000),
    createdAt: new Date(),
  });
}

export async function sessionExists(jti: string): Promise<boolean> {
  const doc = await (
    await collection()
  ).findOne({ jti, expiresAt: { $gt: new Date() } });
  return !!doc;
}

export async function deleteSession(jti: string): Promise<void> {
  await (await collection()).deleteOne({ jti });
}

export async function rotateSession(
  oldJti: string,
  username: string,
  ttlSec: number,
): Promise<string> {
  const newJti = crypto.randomUUID();
  const coll = await collection();
  await coll.deleteOne({ jti: oldJti });
  await coll.insertOne({
    jti: newJti,
    username,
    expiresAt: new Date(Date.now() + ttlSec * 1000),
    createdAt: new Date(),
  });
  return newJti;
}