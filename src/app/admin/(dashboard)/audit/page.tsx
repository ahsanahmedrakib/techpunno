import AuditLog from "@/features/admin/components/AuditLog";
import { requireRole } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export default async function AuditPage() {
  await requireRole(["superadmin", "admin"]);
  return <AuditLog />;
}