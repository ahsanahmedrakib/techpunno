import UsersManager from "@/components/admin/UsersManager";
import { requireRole } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  await requireRole(["superadmin", "admin"]);
  return <UsersManager />;
}