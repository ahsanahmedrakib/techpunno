import DeletedDataPage from "@/features/admin/components/DeletedDataPage";
import { requireRole } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export default async function DeletedPage() {
  await requireRole(["superadmin", "admin"]);
  return <DeletedDataPage />;
}