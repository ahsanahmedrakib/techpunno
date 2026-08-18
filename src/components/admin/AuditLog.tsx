"use client";

import { api, type UserRole } from "@/lib/api";
import { tables, type TableKey } from "@/lib/tables";
import { formatDateAndTime } from "@/lib/utils";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Inbox,
  RefreshCw,
  ScrollText,
  Search,
  ShieldCheck,
} from "lucide-react";
import { useState } from "react";
import TablePagination from "./TablePagination";
import TableSkeleton from "./TableSkeleton";

const PAGE_SIZE = 25;

const ACTIONS = [
  "create",
  "update",
  "delete",
  "restore",
  "permanent_delete",
  "approve",
  "reject",
  "resign",
  "status_change",
  "login",
  "logout",
  "user_create",
  "user_update",
  "user_delete",
] as const;

const actionMeta: Record<string, { label: string; badge: string }> = {
  create: { label: "Created", badge: "bg-emerald-100 text-emerald-700" },
  update: { label: "Updated", badge: "bg-blue-100 text-blue-700" },
  delete: { label: "Deleted", badge: "bg-rose-100 text-rose-700" },
  restore: { label: "Restored", badge: "bg-amber-100 text-amber-700" },
  permanent_delete: {
    label: "Permanently deleted",
    badge: "bg-red-700 text-white",
  },
  approve: { label: "Approved", badge: "bg-emerald-100 text-emerald-700" },
  reject: { label: "Rejected", badge: "bg-rose-100 text-rose-700" },
  resign: { label: "Resigned", badge: "bg-slate-200 text-slate-700" },
  status_change: {
    label: "Status changed",
    badge: "bg-blue-100 text-blue-700",
  },
  login: { label: "Signed in", badge: "bg-teal-100 text-teal-700" },
  logout: { label: "Signed out", badge: "bg-slate-100 text-slate-600" },
  user_create: {
    label: "User created",
    badge: "bg-emerald-100 text-emerald-700",
  },
  user_update: { label: "User updated", badge: "bg-blue-100 text-blue-700" },
  user_delete: { label: "User deleted", badge: "bg-rose-100 text-rose-700" },
};

const roleBadge = (role: UserRole) => {
  if (role === "superadmin")
    return "bg-amber-100 text-amber-800 border border-amber-300";
  if (role === "admin")
    return "bg-primary-lighter text-primary border border-primary/40";
  return "bg-slate-100 text-slate-600 border border-slate-300";
};

export default function AuditLog() {
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(PAGE_SIZE);
  const [table, setTable] = useState("");
  const [action, setAction] = useState("");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const { data, isLoading, isFetching, refetch } = useQuery({
    queryKey: ["audit", page, pageSize, table, action, debouncedSearch],
    queryFn: () =>
      api.audit({
        page,
        pageSize,
        table: table || undefined,
        action: action || undefined,
        search: debouncedSearch || undefined,
      }),
    placeholderData: keepPreviousData,
  });

  const docs = data?.docs ?? [];
  const total = data?.total ?? 0;
  const totalPages = data?.totalPages ?? 1;

  const tableLabel = (key: string) =>
    key === "users"
      ? "Users"
      : key === "auth"
        ? "Auth"
        : (tables[key as TableKey]?.singular ?? key);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-lg border-2 border-primary/30 bg-white px-4 py-3 shadow-sm lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-3">
          <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-lighter text-primary">
            <ScrollText className="h-4.5 w-4.5" />
          </span>
          <div>
            <h3 className="text-sm font-bold text-ink">Audit Log</h3>
            <p className="mt-0.5 text-xs text-ink-soft">
              Track who created, updated, deleted or approved records
            </p>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="relative">
            <Search className="absolute top-1/2 left-3 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
            <input
              type="text"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
                const value = e.target.value;
                window.setTimeout(() => setDebouncedSearch(value), 400);
              }}
              placeholder="Search summary / actor"
              className="w-56 rounded-lg border border-ink/10 bg-white py-2 pr-3 pl-9 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/50 focus:border-primary"
            />
          </div>
          <select
            value={table}
            onChange={(e) => {
              setTable(e.target.value);
              setPage(1);
            }}
            className="cursor-pointer rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink outline-none transition-colors focus:border-primary"
          >
            <option value="">All tables</option>
            {[
              ...Object.keys(tables),
              "users",
              "auth",
            ]
              .sort((a, b) => tableLabel(a).localeCompare(tableLabel(b)))
              .map((key) => (
                <option key={key} value={key}>
                  {tableLabel(key)}
                </option>
              ))}
          </select>
          <select
            value={action}
            onChange={(e) => {
              setAction(e.target.value);
              setPage(1);
            }}
            className="cursor-pointer rounded-lg border border-ink/10 bg-white px-3 py-2 text-sm font-medium text-ink outline-none transition-colors focus:border-primary"
          >
            <option value="">All actions</option>
            {ACTIONS.map((a) => (
              <option key={a} value={a}>
                {actionMeta[a].label}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => void refetch()}
            disabled={isFetching}
            title="Refresh"
            className="cursor-pointer grid h-9 w-9 place-items-center rounded-lg border-2 border-primary/30 bg-white text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter hover:text-primary disabled:cursor-not-allowed disabled:opacity-50"
          >
            <RefreshCw
              className={`h-4 w-4 ${isFetching ? "animate-spin" : ""}`}
            />
          </button>
        </div>
      </div>

      {isLoading ? (
        <TableSkeleton
          columns={["Time", "Actor", "Action", "Table", "Details"]}
          rows={10}
        />
      ) : (
        <div className="overflow-hidden rounded-lg border border-ink/10 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-linear-to-r from-[#1a3a68] to-primary text-white">
                  <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                    Time
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                    Actor
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                    Action
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                    Table
                  </th>
                  <th className="px-4 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody>
                {docs.length === 0 ? (
                  <tr>
                    <td colSpan={5} className="px-4 py-16 text-center">
                      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-mist text-ink-soft/30">
                        <Inbox className="h-6 w-6" />
                      </div>
                      <p className="text-sm font-medium text-ink-soft">
                        No audit entries found
                      </p>
                    </td>
                  </tr>
                ) : (
                  docs.map((entry, idx) => {
                    const meta = actionMeta[entry.action] ?? {
                      label: entry.action,
                      badge: "bg-slate-100 text-slate-600",
                    };
                    return (
                      <tr
                        key={entry.id ?? idx}
                        className="border-t border-ink/10 transition-colors odd:bg-white even:bg-mist/30 hover:bg-primary-lighter/40"
                      >
                        <td className="px-4 py-3 font-medium whitespace-nowrap text-ink-soft">
                          {formatDateAndTime(entry.createdAt)}
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-ink">
                              {entry.actor}
                            </span>
                            <span
                              className={`inline-block rounded-full px-2 py-0.5 text-[10px] font-semibold ${roleBadge(entry.actorRole)}`}
                            >
                              {entry.actorRole}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={`inline-block rounded-full px-2.5 py-1 text-[11px] font-semibold ${meta.badge}`}
                          >
                            {meta.label}
                          </span>
                        </td>
                        <td className="px-4 py-3 font-medium whitespace-nowrap text-ink-soft">
                          {tableLabel(entry.table)}
                        </td>
                        <td className="px-4 py-3 text-ink-soft">
                          <span className="flex items-center gap-2">
                            {entry.table === "users" && (
                              <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-ink-soft/40" />
                            )}
                            <span
                              className="max-w-md truncate"
                              title={entry.summary}
                            >
                              {entry.summary}
                            </span>
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
          <TablePagination
            page={page}
            pageSize={pageSize}
            total={total}
            totalPages={totalPages}
            onPageChange={(p) => {
              setPage(p);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            onPageSizeChange={(size) => {
              setPageSize(size);
              setPage(1);
            }}
          />
        </div>
      )}
    </div>
  );
}

