import { Collection, ObjectId } from "mongodb";
import bcrypt from "bcryptjs";
import { getMongoClient, getDbName } from "@/lib/mongodb";
import { HttpError } from "@/lib/db";

export type UserRole = "superadmin" | "admin" | "editor";

export interface AuthUser {
  username: string;
  role: UserRole;
}

export interface UserRecord {
  _id?: ObjectId;
  id?: string;
  username: string;
  passwordHash: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
  lastLoginAt: string | null;
  deletedAt: string | null;
}

export type PublicUser = Omit<UserRecord, "passwordHash">;

export const DEFAULT_SUPERADMIN_USERNAME = "admin";
export const DEFAULT_SUPERADMIN_PASSWORD = "TestPass@123";

export const USER_ROLES: UserRole[] = ["superadmin", "admin", "editor"];
export const CREATABLE_ROLES: UserRole[] = ["admin", "editor"];

async function collection(): Promise<Collection<UserRecord>> {
  const client = await getMongoClient();
  return client.db(getDbName()).collection<UserRecord>("users");
}

async function ensureIndexes(): Promise<void> {
  try {
    const coll = await collection();
    await coll.createIndex({ username: 1 }, { unique: true });
  } catch {
    // Non-fatal: uniqueness is still enforced by pre-insert checks.
  }
}

export function publicUser(user: UserRecord): PublicUser {
  const { passwordHash, ...rest } = user;
  void passwordHash;
  return { ...rest, id: String(user._id ?? user.id ?? "") };
}

export async function getUserByUsername(
  username: string,
): Promise<UserRecord | null> {
  const coll = await collection();
  const doc = (await coll.findOne({ username })) as UserRecord | null;
  return doc ?? null;
}

export async function getUserById(id: string): Promise<UserRecord | null> {
  const coll = await collection();
  try {
    const doc = (await coll.findOne({ _id: new ObjectId(id) })) as
      | UserRecord
      | null;
    return doc ?? null;
  } catch {
    return null;
  }
}

export async function listUsers(): Promise<UserRecord[]> {
  const coll = await collection();
  const docs = (await coll
    .find({})
    .sort({ createdAt: 1 })
    .toArray()) as UserRecord[];
  return docs;
}

export async function ensureSuperAdmin(): Promise<void> {
  const coll = await collection();
  await ensureIndexes();
  const existing = await coll.findOne({ role: "superadmin" });
  if (existing) return;

  const hash = await bcrypt.hash(DEFAULT_SUPERADMIN_PASSWORD, 12);
  const now = new Date().toISOString();
  try {
    await coll.insertOne({
      username: DEFAULT_SUPERADMIN_USERNAME,
      passwordHash: hash,
      role: "superadmin",
      createdAt: now,
      updatedAt: now,
      lastLoginAt: null,
      deletedAt: null,
    } as never);
  } catch {
    // A concurrent seed may have inserted it already.
  }
}

export async function verifyUserCredentials(
  username: string,
  password: string,
): Promise<UserRecord | null> {
  const user = await getUserByUsername(username);
  if (!user) return null;
  const ok = await bcrypt.compare(password, user.passwordHash);
  return ok ? user : null;
}

export async function markLastLogin(
  username: string,
  time: string = new Date().toISOString(),
): Promise<void> {
  const coll = await collection();
  await coll.updateOne({ username }, { $set: { lastLoginAt: time } });
}

export async function createUser(input: {
  username: string;
  password: string;
  role: UserRole;
}): Promise<PublicUser> {
  const username = input.username.trim();
  if (!username) {
    throw new HttpError("Username is required", 400);
  }
  if (!input.password) {
    throw new HttpError("Password is required", 400);
  }
  if (!CREATABLE_ROLES.includes(input.role)) {
    throw new HttpError("Only admin and editor roles can be created", 400);
  }

  const coll = await collection();
  const exists = await coll.findOne({ username }, { projection: { _id: 1 } });
  if (exists) {
    throw new HttpError("A user with this username already exists", 409);
  }

  const hash = await bcrypt.hash(input.password, 12);
  const now = new Date().toISOString();
  const doc: UserRecord = {
    username,
    passwordHash: hash,
    role: input.role,
    createdAt: now,
    updatedAt: now,
    lastLoginAt: null,
    deletedAt: null,
  };
  try {
    const result = await coll.insertOne(doc as never);
    return publicUser({ ...doc, _id: result.insertedId });
  } catch (error) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: unknown }).code === 11000
    ) {
      throw new HttpError("A user with this username already exists", 409);
    }
    throw error;
  }
}

export async function updateUser(
  id: string,
  input: { username?: string; role?: UserRole; password?: string },
): Promise<PublicUser> {
  const coll = await collection();
  let existing: UserRecord | null;
  try {
    existing = (await coll.findOne({ _id: new ObjectId(id) })) as
      | UserRecord
      | null;
  } catch {
    existing = null;
  }
  if (!existing) {
    throw new HttpError("User not found", 404);
  }

  const update: Record<string, unknown> = {
    updatedAt: new Date().toISOString(),
  };

  if (existing.role === "superadmin") {
    if (!input.password) {
      throw new HttpError("The superadmin can only update the password", 400);
    }
    update.passwordHash = await bcrypt.hash(input.password, 12);
  } else {
    if (input.username !== undefined) {
      const username = input.username.trim();
      if (!username) {
        throw new HttpError("Username is required", 400);
      }
      const dup = await coll.findOne(
        { username, _id: { $ne: new ObjectId(id) } },
        { projection: { _id: 1 } },
      );
      if (dup) {
        throw new HttpError("A user with this username already exists", 409);
      }
      update.username = username;
    }
    if (input.role !== undefined) {
      if (input.role === "superadmin") {
        throw new HttpError("The superadmin role cannot be assigned", 400);
      }
      if (!USER_ROLES.includes(input.role)) {
        throw new HttpError("Invalid role", 400);
      }
      update.role = input.role;
    }
    if (input.password) {
      update.passwordHash = await bcrypt.hash(input.password, 12);
    }
  }

  const result = (await coll.findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: update },
    { returnDocument: "after" },
  )) as UserRecord | null;
  if (!result) {
    throw new HttpError("User not found", 404);
  }
  return publicUser(result);
}

export async function deleteUser(id: string): Promise<boolean> {
  const coll = await collection();
  let existing: UserRecord | null;
  try {
    existing = (await coll.findOne({ _id: new ObjectId(id) })) as
      | UserRecord
      | null;
  } catch {
    existing = null;
  }
  if (!existing) return false;
  if (existing.role === "superadmin") {
    throw new HttpError("The superadmin cannot be deleted", 403);
  }
  const result = await coll.deleteOne({ _id: new ObjectId(id) });
  return (result.deletedCount ?? 0) > 0;
}