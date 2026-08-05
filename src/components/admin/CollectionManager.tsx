"use client";

import Loading from "@/components/common/Loading";
import {
  api,
  useCreateDoc,
  useDeleteDoc,
  useUpdateDoc,
  type PagedResult,
} from "@/lib/api";
import type { CollectionConfig, CollectionKey } from "@/lib/collections";
import { formatDateAndTime } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Eye, Inbox, Pencil, Plus, Search, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmDialog from "./ConfirmDialog";
import RecordForm from "./RecordForm";
import TablePagination from "./TablePagination";
import TableSkeleton from "./TableSkeleton";

interface Props {
  collectionKey: CollectionKey;
  config: CollectionConfig;
}

export default function CollectionManager({ collectionKey, config }: Props) {
  const router = useRouter();
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const timer = setTimeout(() => {
      const next = searchInput.trim();
      if (next !== search) {
        setSearch(next);
        setPage(1);
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, search]);

  const { data, isLoading, error, isFetching } = useQuery<
    PagedResult<Record<string, unknown>>
  >({
    queryKey: ["collection", collectionKey, page, pageSize, search],
    queryFn: () =>
      api.paged<Record<string, unknown>>(collectionKey, {
        page,
        pageSize,
        search,
      }),
    placeholderData: keepPreviousData,
  });

  const records = data?.docs ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

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
      toast.error(
        "Failed to delete. The record may not exist in the database.",
      );
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
    if (val === "upcoming")
      return "bg-primary-lighter text-primary border-2 border-primary/40";
    if (val === "done") return "bg-mist text-ink-soft border border-ink/15";
    if (val === "Hot")
      return "bg-secondary-light text-secondary border-2 border-secondary/40";
    if (val === "Update")
      return "bg-amber-50 text-amber-600 border-2 border-amber-300";
    if (val === "Announcement")
      return "bg-primary-lighter text-primary border-2 border-primary/40";
    if (val === "Offline")
      return "bg-blue-50 text-blue-600 border-2 border-blue-300";
    if (val === "Online")
      return "bg-purple-50 text-purple-600 border-2 border-purple-300";
    return "bg-mist text-ink-soft border border-ink/15";
  };

  if (config.single && isLoading) {
    return <Loading text="Loading settings..." />;
  }

  if (error) {
    return (
      <div className="rounded-lg border-2 border-secondary/30 bg-white py-20 text-center">
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
        <div className="rounded-lg border-2 border-primary/50 bg-white p-6 shadow-sm">
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
        <div className="rounded-lg border-2 border-primary/50 bg-white p-6 shadow-sm">
          <h3 className="mb-4 text-base font-bold text-ink">
            {view === "create"
              ? `New ${config.singular}`
              : `Edit ${config.singular}`}
          </h3>
          <RecordForm
            fields={config.fields}
            initial={view === "edit" ? (editing ?? undefined) : undefined}
            onSubmit={view === "create" ? handleCreate : handleUpdate}
            onCancel={() => {
              setView("list");
              setEditing(null);
            }}
            submitLabel={view === "create" ? "Create" : "Update"}
          />
        </div>
      )}

      {view === "list" && (
        <>
          <div className="flex flex-col gap-3 rounded-lg border-2 border-primary/30 bg-white px-4 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
            <div className="relative w-full max-w-sm">
              <Search className="pointer-events-none absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder={`Search ${config.label.toLowerCase()}...`}
                className="w-full rounded-lg border border-ink/10 bg-cream py-2 pr-3 pl-9 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-primary focus:ring-2 focus:ring-primary/20"
              />
            </div>
            <div className="flex items-center justify-between gap-3 lg:justify-end">
              {!config.readOnly && (
                <button
                  onClick={() => setView("create")}
                  className="inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  New {config.singular}
                </button>
              )}
            </div>
          </div>

          {isLoading || isFetching ? (
            <TableSkeleton
              columns={config.listColumns.map((c) => getField(c)?.label ?? c)}
              rows={Math.min(pageSize, 10)}
            />
          ) : records.length === 0 ? (
            <div className="rounded-lg border-2 border-primary/30 bg-white py-20 text-center">
              <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mist text-ink-soft/30">
                <Inbox className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium text-ink-soft">
                {search ? "No records match your search" : "No records found"}
              </p>
              <p className="mt-1 text-xs text-ink-soft/60">
                {search
                  ? "Try a different keyword or clear the search"
                  : "Start by creating a new record"}
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-linear-to-r from-[#1a3a68] to-primary text-white">
                      {config.listColumns.map((col) => (
                        <th
                          key={col}
                          className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase"
                        >
                          {getField(col)?.label ?? col}
                        </th>
                      ))}
                      <th className="px-4 py-3.5 text-right text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {records.map((record, idx) => (
                      <tr
                        key={String(record.id ?? idx)}
                        className="border-t border-ink/10 transition-colors odd:bg-white even:bg-mist/30 hover:bg-primary-lighter/40"
                      >
                        {config.listColumns.map((col) => {
                          const val = String(cellValue(record, col));
                          const field = getField(col);
                          const isBadge =
                            field?.type === "select" ||
                            col === "mode" ||
                            col === "status" ||
                            col === "badge";
                          const isDate =
                            col === "createdAt" || col === "updatedAt";
                          return (
                            <td key={col} className="px-4 py-3 text-ink">
                              {isBadge && val !== "\u2014" ? (
                                <span
                                  className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeColor(val)}`}
                                >
                                  {val}
                                </span>
                              ) : isDate && val !== "\u2014" ? (
                                <span className="font-medium whitespace-nowrap text-ink-soft">
                                  {formatDateAndTime(record[col] as string)}
                                </span>
                              ) : (
                                <span
                                  className="line-clamp-1 max-w-72"
                                  title={
                                    val === "\u2014"
                                      ? undefined
                                      : String(record[col])
                                  }
                                >
                                  {val}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        <td className="px-4 py-3">
                          <div className="flex items-center justify-end gap-2">
                            {config.readOnly ? (
                              <button
                                onClick={() =>
                                  router.push(
                                    `/admin/${collectionKey}/${record.id}`,
                                  )
                                }
                                className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border-2 border-primary/30 bg-white px-3 py-1.5 text-xs font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary"
                              >
                                <Eye className="h-3.5 w-3.5" />
                                View
                              </button>
                            ) : (
                              <>
                                <button
                                  onClick={() => {
                                    setEditing(record);
                                    setView("edit");
                                  }}
                                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border-2 border-primary/30 bg-white px-3 py-1.5 text-xs font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary"
                                >
                                  <Pencil className="h-3.5 w-3.5" />
                                  Edit
                                </button>
                                <button
                                  onClick={() =>
                                    setDeletingId(String(record.id))
                                  }
                                  className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border-2 border-secondary/30 bg-white px-3 py-1.5 text-xs font-medium text-secondary transition-all hover:border-secondary/50 hover:bg-secondary-light"
                                >
                                  <Trash2 className="h-3.5 w-3.5" />
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

              <TablePagination
                page={page}
                pageSize={pageSize}
                total={total}
                totalPages={totalPages}
                onPageChange={setPage}
                onPageSizeChange={(size) => {
                  setPageSize(size);
                  setPage(1);
                }}
              />
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

