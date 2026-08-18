import { getMongoClient, getDbName } from "@/lib/mongodb";
import type { AuthUser } from "@/lib/auth/users";

export interface AuditEntry {
  action: string;
  actor: string;
  actorRole: string;
  table: string;
  recordId?: string;
  summary: string;
  changes?: Record<string, unknown>;
  createdAt: string;
}

export type AuditAction =
  | "create"
  | "update"
  | "delete"
  | "restore"
  | "permanent_delete"
  | "approve"
  | "reject"
  | "resign"
  | "status_change"
  | "login"
  | "logout"
  | "user_create"
  | "user_update"
  | "user_delete";

async function collection() {
  const client = await getMongoClient();
  return client.db(getDbName()).collection<AuditEntry>("auditlogs");
}

export async function logAudit(
  entry: Omit<AuditEntry, "createdAt">,
): Promise<void> {
  try {
    const coll = await collection();
    await coll.insertOne({
      ...entry,
      createdAt: new Date().toISOString(),
    } as never);
  } catch {
    // Audit logging is best-effort and must never break the request.
  }
}

export function actorOf(
  admin: AuthUser | null,
): { actor: string; actorRole: string } | null {
  if (!admin) return null;
  return { actor: admin.username, actorRole: admin.role };
}

export function recordLabel(doc: Record<string, unknown>): string {
  const value =
    doc.title ?? doc.name ?? doc.fullName ?? doc.username ?? doc.eventTitle;
  return value !== undefined && value !== null && String(value).trim() !== ""
    ? String(value)
    : "";
}