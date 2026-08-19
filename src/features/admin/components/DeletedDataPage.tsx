"use client";

import ConfirmDialog from "@/features/admin/components/ConfirmDialog";
import TableSkeleton from "@/features/admin/components/TableSkeleton";
import { api } from "@/lib/api";
import { tables, tableKeys, type TableKey } from "@/lib/tables";
import { formatDateAndTime } from "@/lib/utils";
import { keepPreviousData, useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Inbox, RefreshCw, RotateCcw, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

interface DeletedDoc extends Record<string, unknown> {
  _table: string;
}

const identifier = (row: DeletedDoc): string => {
  for (const field of ["title", "name", "volunteerId", "certificateId", "mobile", "id"]) {
    const value = row[field];
    if (value !== undefined && value !== null && String(value).trim() !== "") {
      return String(value);
    }
  }
  return String(row._id ?? "");
};

export default function DeletedDataPage() {
  const qc = useQueryClient();
  const [tableFilter, setTableFilter] = useState("");
  const [permanentTarget, setPermanentTarget] = useState<DeletedDoc | null>(null);

  const { data, isLoading, isFetching, refetch } = useQuery<{
    docs: DeletedDoc[];
    total: number;
  }>({
    queryKey: ["deleted", tableFilter],
    queryFn: () => api.deletedList<DeletedDoc>(tableFilter || undefined),
    placeholderData: keepPreviousData,
  });

  const docs = data?.docs ?? [];
  const total = data?.total ?? 0;

  const restoreMutation = useMutation({
    mutationFn: (doc: DeletedDoc) => api.restoreDeleted(doc._table, String(doc.id)),
    onSuccess: (_data, doc) => {
      toast.success("Row restored");
      qc.invalidateQueries({ queryKey: ["deleted"] });
      qc.invalidateQueries({ queryKey: ["table", doc._table] });
    },
    onError: (err) =>
      toast.error(err instanceof Error ? err.message : "Restore failed"),
  });

  const permanentMutation = useMutation({
    mutationFn: (doc: DeletedDoc) =>
      api.permanentlyDelete(doc._table, String(doc.id)),
    onSuccess: (_data, doc) => {
      toast.success("Permanently deleted");
      setPermanentTarget(null);
      qc.invalidateQueries({ queryKey: ["deleted"] });
      qc.invalidateQueries({ queryKey: ["table", doc._table] });
    },
    onError: (err) =>
      toast.error(
        err instanceof Error ? err.message : "Permanent delete failed",
      ),
  });

  return (
    <div className="space-y-5">
      <div className="flex flex-col gap-3 rounded-lg border-2 border-primary/30 bg-white px-4 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h3 className="text-sm font-bold text-ink">Deleted Data</h3>
          <p className="mt-0.5 text-xs text-ink-soft">
            {total} deleted row{total !== 1 ? "s" : ""}. Hidden from admin
            tables and the website until restored or permanently removed.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={tableFilter}
            onChange={(e) => setTableFilter(e.target.value)}
            className="cursor-pointer rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
          >
            <option value="">All tables</option>
            {tableKeys.map((key) => (
              <option key={key} value={key}>
                {tables[key].label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            title="Refresh"
            className="cursor-pointer inline-flex items-center gap-2 rounded-lg border-2 border-primary/30 bg-white px-3 py-2 text-sm font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`} />
            Refresh
          </button>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton columns={["Source", "Identifier", "Deleted At", "Actions"]} rows={6} />
      ) : (
        <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-linear-to-r from-[#1a3a68] to-primary text-white">
                  <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                    Source
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                    Identifier
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                    Deleted At
                  </th>
                  <th className="px-4 py-3.5 text-right text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {docs.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-16 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mist text-ink-soft/30">
                        <Inbox className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-ink-soft">
                        No deleted data
                      </p>
                      <p className="mt-1 text-xs text-ink-soft/60">
                        Deleted rows will appear here and can be restored.
                      </p>
                    </td>
                  </tr>
                ) : (
                  docs.map((row, idx) => {
                    const isTable = (t: string): t is TableKey =>
                      t in tables;
                    const col = isTable(row._table) ? tables[row._table] : null;
                    const restoring = restoreMutation.isPending &&
                      restoreMutation.variables === row;
                    const removing = permanentMutation.isPending &&
                      permanentMutation.variables === row;
                    return (
                      <tr
                        key={String(row._id ?? idx)}
                        className="border-t border-ink/10 transition-colors odd:bg-white even:bg-mist/30 hover:bg-primary-lighter/40"
                      >
                        <td className="px-4 py-3">
                          <span className="inline-block rounded-full bg-secondary-light px-2.5 py-1 text-[11px] font-semibold text-secondary">
                            {col ? col.label : row._table}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium text-ink">
                          <span
                            className="line-clamp-1 max-w-72"
                            title={identifier(row)}
                          >
                            {identifier(row)}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium whitespace-nowrap text-ink-soft">
                          {formatDateAndTime(String(row.deletedAt ?? ""))}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => restoreMutation.mutate(row)}
                              disabled={restoring}
                              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border-2 border-primary/30 bg-white px-3 py-1.5 text-xs font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <RotateCcw className="h-3.5 w-3.5" />
                              Restore
                            </button>
                            <button
                              onClick={() => setPermanentTarget(row)}
                              disabled={removing}
                              className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border-2 border-secondary/30 bg-white px-3 py-1.5 text-xs font-medium text-secondary transition-all hover:border-secondary/50 hover:bg-secondary-light disabled:cursor-not-allowed disabled:opacity-50"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                              {removing ? "Deleting..." : "Delete"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={!!permanentTarget}
        title="Permanently delete?"
        message="This cannot be undone. The row and its uploaded images will be permanently removed from the database."
        confirmLabel="Delete Permanently"
        onConfirm={() => permanentTarget && permanentMutation.mutate(permanentTarget)}
        onCancel={() => setPermanentTarget(null)}
      />
    </div>
  );
}