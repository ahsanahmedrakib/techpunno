import { Collection, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { EncryptJWT, jwtDecrypt } from "jose";
import type { NextResponse } from "next/server";
import { getMongoClient, getDbName } from "@/lib/mongodb";
import { HttpError } from "@/lib/db";
import { getAccessKey, getRefreshKey } from "./keys";

export const PUBLIC_ACCESS_COOKIE = "tp_pu_at";
export const PUBLIC_REFRESH_COOKIE = "tp_pu_rt";

const ACCESS_TTL_SEC = 60 * 60;
const REFRESH_TTL_SEC = 30 * 24 * 60 * 60;

export interface PublicUser {
  _id: ObjectId;
  id: string;
  name: string;
  email: string;
  mobile: string;
  passwordHash: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface PublicAuthUser {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

export const BD_MOBILE_PATTERN = /^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/;

async function collection(): Promise<Collection<Record<string, unknown>>> {
  const client = await getMongoClient();
  return client
    .db(getDbName())
    .collection<Record<string, unknown>>("publicusers");
}

async function ensureIndexes(): Promise<void> {
  try {
    const coll = await collection();
    await coll.createIndex({ email: 1 }, { unique: true, sparse: true });
    await coll.createIndex({ mobile: 1 }, { unique: true });
  } catch {
    // Non-fatal
  }
}

function toPublicUser(doc: Record<string, unknown>): PublicUser {
  return {
    _id: doc._id as ObjectId,
    id: String(doc.id ?? doc._id ?? ""),
    name: String(doc.name ?? ""),
    email: String(doc.email ?? ""),
    mobile: String(doc.mobile ?? ""),
    passwordHash: String(doc.passwordHash ?? ""),
    createdAt: String(doc.createdAt ?? ""),
    updatedAt: String(doc.updatedAt ?? ""),
    deletedAt: (doc.deletedAt as string | null) ?? null,
  };
}

export async function findPublicUserByIdentifier(
  identifier: string,
): Promise<PublicUser | null> {
  const coll = await collection();
  const clean = identifier.trim().toLowerCase();
  const doc = await coll.findOne({
    deletedAt: null,
    $or: [{ email: clean }, { mobile: identifier.trim() }],
  });
  return doc ? toPublicUser(doc) : null;
}

export async function getPublicUserById(id: string): Promise<PublicUser | null> {
  const coll = await collection();
  let doc = null as Record<string, unknown> | null;
  try {
    doc = (await coll.findOne({
      _id: new ObjectId(id),
      deletedAt: null,
    })) as Record<string, unknown> | null;
  } catch {
    doc = (await coll.findOne({
      id,
      deletedAt: null,
    })) as Record<string, unknown> | null;
  }
  return doc ? toPublicUser(doc) : null;
}

export async function listPublicUsers(): Promise<PublicUser[]> {
  const coll = await collection();
  const docs = (await coll
    .find({ deletedAt: null })
    .sort({ createdAt: 1 })
    .toArray()) as Record<string, unknown>[];
  return docs.map(toPublicUser);
}

export async function registerPublicUser(input: {
  name: string;
  email?: string;
  mobile: string;
  password: string;
}): Promise<PublicAuthUser> {
  await ensureIndexes();
  const name = input.name.trim();
  const mobile = input.mobile.trim();
  const email = (input.email ?? "").trim().toLowerCase();
  if (!name) throw new HttpError("Name is required", 400);
  if (!BD_MOBILE_PATTERN.test(mobile)) {
    throw new HttpError(
      "Enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX)",
      400,
    );
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new HttpError("Enter a valid email address", 400);
  }
  if (!input.password || input.password.length < 6) {
    throw new HttpError("Password must be at least 6 characters", 400);
  }

  const coll = await collection();
  const existing = await coll.findOne({
    deletedAt: null,
    $or: [
      ...(email ? [{ email }] : []),
      ...(mobile ? [{ mobile }] : []),
    ],
  });
  if (existing) {
    throw new HttpError(
      "An account with this mobile number or email already exists",
      409,
    );
  }

  const hash = await bcrypt.hash(input.password, 12);
  const now = new Date().toISOString();
  const id = crypto.randomUUID();

  try {
    const doc = {
      id,
      name,
      email,
      mobile,
      passwordHash: hash,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    };
    await coll.insertOne(doc);
    return { id, name, email, mobile };
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === 11000
    ) {
      throw new HttpError(
        "An account with this mobile number or email already exists",
        409,
      );
    }
    throw error;
  }
}

export async function verifyPublicUserCredentials(
  identifier: string,
  password: string,
): Promise<PublicUser | null> {
  const user = await findPublicUserByIdentifier(identifier);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

interface PublicSession {
  jti: string;
  userId: string;
  expiresAt: Date;
  createdAt: Date;
}

async function sessionCollection() {
  const client = await getMongoClient();
  return client
    .db(getDbName())
    .collection<PublicSession>("publichsessions");
}

export async function createPublicSession(
  userId: string,
  jti: string,
): Promise<void> {
  await (
    await sessionCollection()
  ).insertOne({
    jti,
    userId,
    expiresAt: new Date(Date.now() + REFRESH_TTL_SEC * 1000),
    createdAt: new Date(),
  });
}

export async function publicSessionExists(jti: string): Promise<boolean> {
  const doc = await (await sessionCollection()).findOne({
    jti,
    expiresAt: { $gt: new Date() },
  });
  return !!doc;
}

export async function deletePublicSession(jti: string): Promise<void> {
  await (await sessionCollection()).deleteOne({ jti });
}

export async function rotatePublicSession(
  oldJti: string,
  userId: string,
): Promise<string> {
  const newJti = crypto.randomUUID();
  const coll = await sessionCollection();
  await coll.deleteOne({ jti: oldJti });
  await coll.insertOne({
    jti: newJti,
    userId,
    expiresAt: new Date(Date.now() + REFRESH_TTL_SEC * 1000),
    createdAt: new Date(),
  });
  return newJti;
}

interface PublicTokenUser {
  userId: string;
  jti: string;
}

export async function createPublicAccessToken(
  userId: string,
): Promise<string> {
  return new EncryptJWT({ type: "public-access" })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${ACCESS_TTL_SEC}s`)
    .setJti(crypto.randomUUID())
    .encrypt(await getAccessKey());
}

export async function createPublicRefreshToken(
  userId: string,
  jti: string,
): Promise<string> {
  return new EncryptJWT({ type: "public-refresh" })
    .setProtectedHeader({ alg: "dir", enc: "A256GCM" })
    .setSubject(userId)
    .setIssuedAt()
    .setExpirationTime(`${REFRESH_TTL_SEC}s`)
    .setJti(jti)
    .encrypt(await getRefreshKey());
}

export async function verifyPublicAccessToken(
  token: string,
): Promise<PublicTokenUser | null> {
  try {
    const { payload } = await jwtDecrypt(token, await getAccessKey());
    if (payload.type !== "public-access" || !payload.sub || !payload.jti)
      return null;
    return { userId: payload.sub, jti: payload.jti };
  } catch {
    return null;
  }
}

export async function verifyPublicRefreshToken(
  token: string,
): Promise<PublicTokenUser | null> {
  try {
    const { payload } = await jwtDecrypt(token, await getRefreshKey());
    if (payload.type !== "public-refresh" || !payload.sub || !payload.jti)
      return null;
    return { userId: payload.sub, jti: payload.jti };
  } catch {
    return null;
  }
}

export function setPublicAuthCookies(
  res: NextResponse,
  accessToken: string,
  refreshToken: string,
): void {
  const secure = process.env.NODE_ENV === "production";
  res.cookies.set(PUBLIC_ACCESS_COOKIE, accessToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: ACCESS_TTL_SEC,
  });
  res.cookies.set(PUBLIC_REFRESH_COOKIE, refreshToken, {
    httpOnly: true,
    sameSite: "lax",
    secure,
    path: "/",
    maxAge: REFRESH_TTL_SEC,
  });
}

export function clearPublicAuthCookies(res: NextResponse): void {
  res.cookies.set(PUBLIC_ACCESS_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  res.cookies.set(PUBLIC_REFRESH_COOKIE, "", {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
}

export async function getPublicUserFromRequest(
  req: { cookies: { get: (n: string) => { value?: string } | undefined } },
): Promise<PublicAuthUser | null> {
  const token = req.cookies.get(PUBLIC_ACCESS_COOKIE)?.value;
  if (!token) return null;
  const parsed = await verifyPublicAccessToken(token);
  if (!parsed) return null;
  const user = await getPublicUserById(parsed.userId);
  if (!user) return null;
  return { id: user.id, name: user.name, email: user.email, mobile: user.mobile };
}
