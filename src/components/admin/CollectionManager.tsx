"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import {
  useCollectionQuery,
  useCreateDoc,
  useUpdateDoc,
  useDeleteDoc,
} from "@/lib/api";
import type { CollectionConfig, CollectionKey } from "@/lib/collections";
import RecordForm from "./RecordForm";
import ConfirmDialog from "./ConfirmDialog";
import Loading from "@/components/common/Loading";

interface Props {
  collectionKey: CollectionKey;
  config: CollectionConfig;
}

export default function CollectionManager({ collectionKey, config }: Props) {
  const router = useRouter();
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { data: records = [], isLoading, error } = useCollectionQuery<Record<string, unknown>>(collectionKey);
  const createMutation = useCreateDoc(collectionKey);
  const updateMutation = useUpdateDoc(collectionKey);
  const deleteMutation = useDeleteDoc(collectionKey);

  const handleCreate = async (data: Record<string, unknown>) => {
    try {
      await createMutation.mutateAsync(data);
      toast.success(`${config.singular} created`);
      setView("list");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Create failed");
    }
  };

  const handleUpdate = async (data: Record<string, unknown>) => {
    if (!editing) return;
    try {
      await updateMutation.mutateAsync({ id: String(editing.id), data });
      toast.success(`${config.singular} updated`);
      setView("list");
      setEditing(null);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id);
      toast.success(`${config.singular} deleted`);
    } catch {
      toast.error("Failed to delete. The record may not exist in the database.");
    }
    setDeletingId(null);
  };

  const getField = (name: string) => config.fields.find((f) => f.name === name);

  const cellValue = (record: Record<string, unknown>, col: string) => {
    const val = record[col];
    if (val === null || val === undefined) return "\u2014";
    if (Array.isArray(val)) return val.join(", ");
    const str = String(val);
    return str.length > 80 ? str.slice(0, 80) + "..." : str;
  };

  const badgeColor = (val: string) => {
    if (val === "upcoming") return "bg-primary-lighter text-primary border-2 border-primary/40";
    if (val === "done") return "bg-mist text-ink-soft border border-ink/15";
    if (val === "Hot") return "bg-secondary-light text-secondary border-2 border-secondary/40";
    if (val === "Update") return "bg-amber-50 text-amber-600 border-2 border-amber-300";
    if (val === "Announcement") return "bg-primary-lighter text-primary border-2 border-primary/40";
    if (val === "Offline") return "bg-blue-50 text-blue-600 border-2 border-blue-300";
    if (val === "Online") return "bg-purple-50 text-purple-600 border-2 border-purple-300";
    return "bg-mist text-ink-soft border border-ink/15";
  };

  if (isLoading) {
    return <Loading text="Loading records..." />;
  }

  if (error) {
    return (
      <div className="rounded-2xl border-2 border-secondary/30 bg-white py-20 text-center">
        <p className="text-sm font-medium text-secondary">
          {(error as Error).message || "Failed to load data"}
        </p>
      </div>
    );
  }

  if (config.single) {
    const record = records[0] ?? {};
    return (
      <div className="mx-auto max-w-2xl">
        <div className="rounded-2xl border-2 border-primary/50 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-ink">{config.label}</h3>
          <RecordForm
            fields={config.fields}
            initial={record}
            onSubmit={handleUpdate}
            onCancel={() => {}}
            submitLabel="Save Settings"
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {(view === "create" || view === "edit") && (
        <div className="rounded-2xl border-2 border-primary/50 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-ink">
            {view === "create" ? `New ${config.singular}` : `Edit ${config.singular}`}
          </h3>
          <RecordForm
            fields={config.fields}
            initial={view === "edit" ? (editing ?? undefined) : undefined}
            onSubmit={view === "create" ? handleCreate : handleUpdate}
            onCancel={() => { setView("list"); setEditing(null); }}
            submitLabel={view === "create" ? "Create" : "Update"}
          />
        </div>
      )}

      {view === "list" && (
        <>
          <div className="flex items-center justify-between rounded-2xl border-2 border-primary/40 bg-white px-5 py-4 shadow-sm">
            <p className="text-sm font-medium text-ink">
              {records.length} record{records.length !== 1 ? "s" : ""}
            </p>
            {!config.readOnly && (
              <button
                onClick={() => setView("create")}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                New {config.singular}
              </button>
            )}
          </div>

          {records.length === 0 ? (
            <div className="rounded-2xl border-2 border-primary/30 bg-white py-20 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mist text-2xl text-ink-soft/30">?</div>
              <p className="text-sm font-medium text-ink-soft">No records found</p>
              <p className="mt-1 text-xs text-ink-soft/60">Start by creating a new record</p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-2xl border-2 border-primary/50 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="border-b-2 border-primary/20 bg-primary-tint">
                      {config.listColumns.map((col) => (
                        <th key={col} className="px-5 py-3.5 text-[11px] font-bold uppercase tracking-wider text-ink-soft/70">
                          {getField(col)?.label ?? col}
                        </th>
                      ))}
                      <th className="px-5 py-3.5 text-right text-[11px] font-bold uppercase tracking-wider text-ink-soft/70">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, idx) => (
                      <tr key={String(record.id ?? idx)} className="border-b-2 border-primary/10 transition-colors hover:bg-primary-tint/50 last:border-b-0">
                        {config.listColumns.map((col) => {
                          const val = String(cellValue(record, col));
                          const field = getField(col);
                          const isBadge = field?.type === "select" || col === "mode" || col === "status" || col === "badge";
                          return (
                            <td key={col} className="px-5 py-3.5 text-ink">
                              {isBadge && val !== "\u2014" ? (
                                <span className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeColor(val)}`}>{val}</span>
                              ) : (
                                <span className="line-clamp-1">{val}</span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            {config.readOnly ? (
                              <button
                                onClick={() => router.push(`/admin/${collectionKey}/${record.id}`)}
                                className="inline-flex items-center gap-1.5 rounded-lg border-2 border-primary/30 bg-white px-3 py-1.5 text-xs font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary"
                              >
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
                                </svg>
                                View
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => { setEditing(record); setView("edit"); }}
                                  className="inline-flex items-center gap-1.5 rounded-lg border-2 border-primary/30 bg-white px-3 py-1.5 text-xs font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                  </svg>
                                  Edit
                                </button>
                                <button
                                  onClick={() => setDeletingId(String(record.id))}
                                  className="inline-flex items-center gap-1.5 rounded-lg border-2 border-secondary/30 bg-white px-3 py-1.5 text-xs font-medium text-secondary transition-all hover:border-secondary/50 hover:bg-secondary-light"
                                >
                                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <polyline points="3 6 5 6 21 6" />
                                    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                                  </svg>
                                  Delete
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deletingId}
        title={`Delete ${config.singular}?`}
        message="This action cannot be undone. The record will be permanently removed."
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}
