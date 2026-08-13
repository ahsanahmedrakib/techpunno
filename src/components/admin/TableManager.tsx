"use client";

import Loading from "@/components/common/Loading";
import {
  api,
  useCreateDoc,
  useDeleteDoc,
  useUpdateDoc,
  type PagedResult,
} from "@/lib/api";
import type { TableConfig, TableKey } from "@/lib/tables";
import { safeImage } from "@/lib/imageUrl";
import { formatDateAndTime } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { Check, Eye, Hourglass, Inbox, Pencil, Plus, RefreshCw, Search, Trash2, X } from "lucide-react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import ConfirmDialog from "./ConfirmDialog";
import RowForm from "./RowForm";
import TablePagination from "./TablePagination";
import TableSkeleton from "./TableSkeleton";

interface Props {
  tableKey: TableKey;
  config: TableConfig;
}

export default function TableManager({ tableKey, config }: Props) {
  const router = useRouter();
  const [view, setView] = useState<"list" | "create" | "edit">("list");
  const [editing, setEditing] = useState<Record<string, unknown> | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

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

  const statusField = config.statusField;
  const statusOptions = config.statusOptions ?? [];

  const imageField = config.fields.find(
  (f) => f.type === "image" || f.type === "images",
);
  const columns =
    imageField && !config.listColumns.includes(imageField.name)
      ? [imageField.name, ...config.listColumns]
      : config.listColumns;

  const formFields =
    view === "create" && config.createFields
      ? config.fields.filter((f) => config.createFields!.includes(f.name))
      : view === "edit" && config.editableFields
        ? config.fields.filter((f) =>
            config.editableFields!.includes(f.name),
          )
        : config.fields;

  const { data, isLoading, error, isFetching, refetch } = useQuery<
    PagedResult<Record<string, unknown>>
  >({
    queryKey: [
      "table",
      tableKey,
      page,
      pageSize,
      search,
      statusFilter,
      statusField,
    ],
    queryFn: () =>
      api.paged<Record<string, unknown>>(tableKey, {
        page,
        pageSize,
        search,
        filterField: statusField,
        filterValue: statusFilter || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const rows = data?.docs ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const createMutation = useCreateDoc(tableKey);
  const updateMutation = useUpdateDoc(tableKey);
  const deleteMutation = useDeleteDoc(tableKey);

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
      toast.error("Failed to delete. The row may not exist in the database.");
    }
    setDeletingId(null);
  };

  const handleStatusChange = async (
    id: string,
    value: string,
    label: string,
  ) => {
    if (!statusField) return;
    try {
      await updateMutation.mutateAsync({
        id,
        data: { [statusField]: value },
      });
      toast.success(`${config.singular} marked as ${label.toLowerCase()}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Update failed");
    }
  };

  const getField = (name: string) => config.fields.find((f) => f.name === name);

  const cellValue = (row: Record<string, unknown>, col: string) => {
    const val = row[col];
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
    if (val === "pending")
      return "bg-amber-50 text-amber-600 border-2 border-amber-300";
    if (val === "approved")
      return "bg-primary-lighter text-primary border-2 border-primary/40";
    if (val === "rejected")
      return "bg-secondary-light text-secondary border-2 border-secondary/40";
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
    const row = rows[0] ?? {};
    const rowId = row.id ? String(row.id) : "";

    const handleSingleSubmit = async (data: Record<string, unknown>) => {
      try {
        if (rowId) {
          await updateMutation.mutateAsync({ id: rowId, data });
          toast.success(`${config.singular} updated`);
        } else {
          await createMutation.mutateAsync(data);
          toast.success(`${config.singular} created`);
        }
      } catch (err) {
        toast.error(err instanceof Error ? err.message : "Save failed");
      }
    };

    return (
      <div className="mx-auto max-w-7xl">
        <div className="overflow-hidden rounded-lg border-2 border-primary/50 bg-white shadow-sm">
          <div className="flex items-center justify-between bg-linear-to-r from-[#1a3a68] to-primary px-5 py-3.5">
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              {config.label}
            </h3>
          </div>
          <div className="p-6">
            <p className="mb-4 text-xs text-ink-soft">
              {rowId
                ? "This configuration is saved. Editing it updates the existing record."
                : "No configuration saved yet. Saving creates the record — afterwards you can only update it."}
            </p>
            <RowForm
              fields={config.fields}
              initial={row}
              onSubmit={handleSingleSubmit}
              onCancel={() => {}}
              submitLabel={rowId ? "Save Settings" : "Add Settings"}
              uploadDir={tableKey}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {(view === "create" || view === "edit") && (
        <div className="overflow-hidden rounded-lg border-2 border-primary/50 bg-white shadow-sm">
          <div className="flex items-center justify-between bg-linear-to-r from-[#1a3a68] to-primary px-5 py-3.5">
            <h3 className="text-sm font-bold tracking-wider text-white uppercase">
              {view === "create"
                ? `New ${config.singular}`
                : `Edit ${config.singular}`}
            </h3>
          </div>
          <div className="p-6">
            <RowForm
              fields={formFields}
              initial={view === "edit" ? (editing ?? undefined) : undefined}
              onSubmit={view === "create" ? handleCreate : handleUpdate}
              onCancel={() => {
                setView("list");
                setEditing(null);
              }}
              submitLabel={view === "create" ? "Create" : "Update"}
              uploadDir={tableKey}
            />
          </div>
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
              <button
                type="button"
                onClick={() => void refetch()}
                disabled={isFetching}
                title="Refresh"
                className="cursor-pointer inline-flex items-center gap-2 rounded-lg border-2 border-primary/30 bg-white px-3 py-2 text-sm font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
              >
                <RefreshCw
                  className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
                />
                Refresh
              </button>
              {statusField && statusOptions.length > 0 && (
                <select
                  value={statusFilter}
                  onChange={(e) => {
                    setStatusFilter(e.target.value);
                    setPage(1);
                  }}
                  className="cursor-pointer rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink outline-none transition-colors focus:border-primary focus:ring-2 focus:ring-primary/20"
                >
                  <option value="">All status</option>
                  {statusOptions.map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              )}
              {(!config.readOnly || config.canCreate) && (
                <button
                  onClick={() => setView("create")}
                  className="cursor-pointer inline-flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark hover:shadow-lg"
                >
                  <Plus className="h-4 w-4" />
                  New {config.singular}
                </button>
              )}
            </div>
          </div>

          {isLoading || isFetching ? (
            <TableSkeleton
              columns={columns.map((c) => getField(c)?.label ?? c)}
              rows={Math.min(pageSize, 10)}
            />
          ) : (
            <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead>
                    <tr className="bg-linear-to-r from-[#1a3a68] to-primary text-white">
                      {columns.map((col) => (
                        <th
                          key={col}
                          className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase"
                        >
                          {getField(col)?.type === "image"
                            ? "Image"
                            : getField(col)?.label ?? col}
                        </th>
                      ))}
                      <th className="sticky right-0 z-10 bg-[#087a49] px-4 py-3.5 text-right text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.4)]">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.length === 0 ? (
                      <tr>
                        <td
                          colSpan={columns.length + 1}
                          className="px-4 py-16 text-center"
                        >
                          <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mist text-ink-soft/30">
                            <Inbox className="h-6 w-6" />
                          </div>
                          <p className="text-sm font-medium text-ink-soft">
                            {search ? "No rows match your search" : "No rows found"}
                          </p>
                          <p className="mt-1 text-xs text-ink-soft/60">
                            {search
                              ? "Try a different keyword or clear the search"
                              : "Start by creating a new row"}
                          </p>
                        </td>
                      </tr>
                    ) : (
                      rows.map((row, idx) => (
                        <tr
                          key={String(row.id ?? idx)}
                          className="border-t border-ink/10 transition-colors odd:bg-white even:bg-mist/30 hover:bg-primary-lighter/40"
                        >
                          {columns.map((col) => {
                            const val = String(cellValue(row, col));
                            const rawVal = row[col];
                            const field = getField(col);
                            const isImagesField = field?.type === "images";
                            const safeSrc = safeImage(
                              isImagesField && Array.isArray(rawVal)
                                ? String(rawVal[0] ?? "")
                                : String(rawVal),
                            );
                            const isImage =
                              (field?.type === "image" || isImagesField) &&
                              safeSrc !== "";
                            const isBadge =
                              field?.type === "select" ||
                              col === "mode" ||
                              col === "status" ||
                              col === "badge";
                            const isDate =
                              col === "createdAt" || col === "updatedAt";
                            return (
                              <td key={col} className="px-4 py-3 text-ink">
                                {isImage ? (
                                  <Image
                                    src={safeSrc}
                                    alt={String(row.title ?? row.name ?? "")}
                                    width={48}
                                    height={48}
                                    unoptimized
                                    className="h-12 w-12 rounded-lg border-2 border-primary/30 bg-mist object-cover"
                                  />
                                ) : isBadge && val !== "\u2014" ? (
                                  <span
                                    className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${badgeColor(val)}`}
                                  >
                                    {val}
                                  </span>
                                ) : isDate && val !== "\u2014" ? (
                                  <span className="font-medium whitespace-nowrap text-ink-soft">
                                    {formatDateAndTime(row[col] as string)}
                                  </span>
                                ) : (
                                  <span
                                    className="line-clamp-1 max-w-72"
                                    title={
                                      val === "\u2014"
                                        ? undefined
                                        : String(row[col])
                                    }
                                  >
                                    {val}
                                  </span>
                                )}
                              </td>
                            );
                          })}
                          <td
                            className={`sticky right-0 z-10 px-4 py-3 shadow-[-6px_0_8px_-6px_rgba(0,0,0,0.15)] ${
                              idx % 2 === 0
                                ? "bg-white hover:bg-[#f5fcf9]"
                                : "bg-[#fafbfb] hover:bg-[#f2f9f6]"
                            }`}
                          >
                            <div className="flex items-center justify-end gap-1.5">
                              {config.readOnly ? (
                                <>
                                  <button
                                    onClick={() =>
                                      router.push(`/admin/${tableKey}/${row.id}`)
                                    }
                                    title="View"
                                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-2 border-primary/30 bg-white text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary"
                                  >
                                    <Eye className="h-4 w-4" />
                                  </button>
                                  {config.editableFields &&
                                    config.editableFields.length > 0 && (
                                      <button
                                        onClick={() => {
                                          setEditing(row);
                                          setView("edit");
                                        }}
                                        title="Edit"
                                        className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-2 border-primary/30 bg-white text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary"
                                      >
                                        <Pencil className="h-4 w-4" />
                                      </button>
                                    )}
                                  {config.deletable && (
                                    <button
                                      onClick={() =>
                                        setDeletingId(String(row.id))
                                      }
                                      title="Delete"
                                      className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-2 border-secondary/30 bg-white text-secondary transition-all hover:border-secondary/50 hover:bg-secondary-light"
                                    >
                                      <Trash2 className="h-4 w-4" />
                                    </button>
                                  )}
                                </>
                              ) : (
                                <>
                                  {statusField && statusOptions.length > 0 && (
                                    <>
                                      {statusOptions
                                        .filter(
                                          (opt) =>
                                            String(row[statusField] ?? "") !==
                                            opt,
                                        )
                                        .map((opt) => {
                                          const isApprove = opt === "approved";
                                          const isReject = opt === "rejected";
                                          return (
                                            <button
                                              key={opt}
                                              onClick={() =>
                                                handleStatusChange(
                                                  String(row.id),
                                                  opt,
                                                  isApprove
                                                    ? "Approved"
                                                    : isReject
                                                      ? "Rejected"
                                                      : "Pending",
                                                )
                                              }
                                              title={`Mark as ${opt}`}
                                              className={`grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-2 transition-all ${
                                                isApprove
                                                  ? "border-primary/40 bg-primary-lighter text-primary hover:border-primary/70 hover:bg-primary-lighter/70"
                                                  : isReject
                                                    ? "border-secondary/40 bg-secondary-light text-secondary hover:border-secondary/70 hover:bg-secondary-light/70"
                                                    : "border-amber-300 bg-amber-50 text-amber-600 hover:border-amber-400"
                                              }`}
                                            >
                                              {isApprove ? (
                                                <Check className="h-4 w-4" />
                                              ) : isReject ? (
                                                <X className="h-4 w-4" />
                                              ) : (
                                                <Hourglass className="h-4 w-4" />
                                              )}
                                            </button>
                                          );
                                        })}
                                    </>
                                  )}
                                  <button
                                    onClick={() => {
                                      setEditing(row);
                                      setView("edit");
                                    }}
                                    title="Edit"
                                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-2 border-primary/30 bg-white text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary"
                                  >
                                    <Pencil className="h-4 w-4" />
                                  </button>
                                  <button
                                    onClick={() => setDeletingId(String(row.id))}
                                    title="Delete"
                                    className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg border-2 border-secondary/30 bg-white text-secondary transition-all hover:border-secondary/50 hover:bg-secondary-light"
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {rows.length > 0 && (
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
              )}
            </div>
          )}
        </>
      )}

      <ConfirmDialog
        open={!!deletingId}
        title={`Delete ${config.singular}?`}
        message="The row will be moved to Deleted Data and hidden from the website. You can restore or permanently delete it later."
        onConfirm={() => deletingId && handleDelete(deletingId)}
        onCancel={() => setDeletingId(null)}
      />
    </div>
  );
}

