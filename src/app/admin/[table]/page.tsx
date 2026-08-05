import { notFound } from "next/navigation";
import { tables, isTableKey, type TableKey } from "@/lib/tables";
import TableManager from "@/components/admin/TableManager";

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

  return <TableManager tableKey={table as TableKey} config={config} />;
}
