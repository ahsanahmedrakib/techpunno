import { notFound } from "next/navigation";
import { tables, isTableKey, type TableKey } from "@/lib/tables";
import TableManager from "@/features/admin/components/TableManager";
import { requireAdmin } from "@/lib/auth/guard";

export const dynamic = "force-dynamic";

export default async function TablePage({
  params,
}: {
  params: Promise<{ table: string }>;
}) {
  const { table } = await params;

  if (!isTableKey(table)) {
    notFound();
  }

  const config = tables[table as TableKey];
  const user = await requireAdmin();

  return (
    <TableManager
      tableKey={table as TableKey}
      config={config}
      role={user.role}
    />
  );
}
