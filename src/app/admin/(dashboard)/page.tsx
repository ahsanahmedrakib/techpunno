"use client";

import Link from "next/link";
import { useQueries, useQuery } from "@tanstack/react-query";
import {
  BadgeCheck,
  Calendar,
  Clapperboard,
  ClipboardList,
  Database,
  FileText,
  Folder,
  GraduationCap,
  HeartHandshake,
  Home,
  Mail,
  Medal,
  Newspaper,
  ScrollText,
  Star,
  Trash2,
  Users,
  Wallet,
  type LucideIcon,
} from "lucide-react";
import { api, useAuthMe } from "@/lib/api";
import { tables, tableKeys, type TableKey } from "@/lib/tables";

const icons: Record<TableKey, LucideIcon> = {
  advisors: Users,
  coreteam: Star,
  blogs: FileText,
  events: Calendar,
  hero: Home,
  news: Newspaper,
  videos: Clapperboard,
  quizsets: ClipboardList,
  contacts: Mail,
  certificates: Medal,
  certificateconfig: BadgeCheck,
  volunteers: HeartHandshake,
  volunteerconfig: Wallet,
  eventregistrations: ClipboardList,
  eventparticipants: Users,
  testimonials: Star,
  courses: GraduationCap,
  courseregistrations: ClipboardList,
};

export default function AdminDashboard() {
  const results = useQueries({
    queries: tableKeys.map((key) => ({
      queryKey: ["table", key],
      queryFn: () => api.paged(key, { page: 1, pageSize: 1 }),
    })),
  });

  const deletedQuery = useQuery({
    queryKey: ["deleted"],
    queryFn: () => api.deletedList<Record<string, unknown>>(),
  });

  const usersQuery = useQuery({
    queryKey: ["users"],
    queryFn: () => api.listUsers(),
  });

  const meQuery = useAuthMe();
  const role = meQuery.data?.role;
  const canManageUsers = role === "superadmin" || role === "admin";
  const canManageDeleted = role === "superadmin" || role === "admin";

  const counts: Record<string, number> = {};
  const sources: Record<string, "db" | "error"> = {};
  tableKeys.forEach((key, i) => {
    const r = results[i];
    if (r.status === "success" && r.data) {
      counts[key] = r.data.total;
      sources[key] = "db";
    } else if (r.status === "error") {
      counts[key] = 0;
      sources[key] = "error";
    } else {
      counts[key] = 0;
      sources[key] = "db";
    }
  });

  const dbCount = Object.values(sources).filter((s) => s === "db").length;
  const loading = results.some((r) => r.status === "pending");

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
        {loading
          ? [0, 1].map((i) => (
              <div
                key={i}
                className="flex items-center gap-4 rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-sm"
              >
                <span className="h-10 w-10 animate-pulse rounded-xl bg-mist" />
                <div className="flex-1">
                  <div className="h-3 w-24 animate-pulse rounded-full bg-mist" />
                  <div className="mt-2 h-7 w-16 animate-pulse rounded-full bg-mist" />
                </div>
              </div>
            ))
          : (
              <>
                <div className="rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-lighter text-primary">
                      <Folder className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
                        Tables
                      </p>
                      <p className="mt-0.5 text-3xl font-bold text-ink">
                        {tableKeys.length}
                      </p>
                    </div>
                  </div>
                </div>
                <div className="rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-sm transition-all hover:shadow-md">
                  <div className="flex items-center gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-lighter text-primary">
                      <Database className="h-5 w-5" />
                    </span>
                    <div>
                      <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
                        DB Connected
                      </p>
                      <p className="mt-0.5 text-3xl font-bold text-ink">
                        {dbCount}/{tableKeys.length}
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}
      </div>

      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink-soft/60">
          Manage Tables
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {loading
            ? Array.from({ length: tableKeys.length }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl border-2 border-primary/30 bg-white p-5 shadow-sm"
                >
                  <div className="flex items-start justify-between">
                    <span className="h-11 w-11 animate-pulse rounded-xl bg-mist" />
                    <span className="h-5 w-16 animate-pulse rounded-full bg-mist" />
                  </div>
                  <div className="mt-3 h-4 w-2/3 animate-pulse rounded-full bg-mist" />
                  <div className="mt-2 h-3 w-1/2 animate-pulse rounded-full bg-mist" />
                </div>
              ))
            : tableKeys
                .map((key) => ({ key, label: tables[key].label }))
                .sort((a, b) => a.label.localeCompare(b.label))
                .map(({ key }) => {
                  const col = tables[key];
                  const count = counts[key] ?? 0;
                  const src = sources[key] ?? "db";
                  const Icon = icons[key];
                  return (
                  <Link
                    key={key}
                    href={`/admin/${key}`}
                    className="group rounded-2xl border-2 border-primary/30 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md"
                  >
                    <div className="flex items-start justify-between">
                      <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream text-primary transition-colors group-hover:bg-primary-lighter">
                        <Icon className="h-5 w-5" />
                      </span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[10px] font-bold ${
                          src === "db"
                            ? "bg-primary-lighter text-primary"
                            : "bg-secondary-light text-secondary"
                        }`}
                      >
                        {src === "db" ? "LIVE" : "ERROR"}
                      </span>
                    </div>
                    <h4 className="mt-3 text-base font-bold text-ink transition-colors group-hover:text-primary">
                      {col.label}
                    </h4>
                    <p className="mt-1 text-xs text-ink-soft">
                      {count} row{count !== 1 ? "s" : ""}
                      {col.readOnly && " · Read-only"}
                      {col.single && " · Single"}
                    </p>
                  </Link>
                );
              })}
              {canManageUsers && (
                <Link
                  href="/admin/users"
                  className="group rounded-2xl border-2 border-dashed border-primary/40 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-lighter text-primary transition-colors group-hover:bg-primary/10">
                      <Users className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-primary-lighter px-2 py-0.5 text-[10px] font-bold text-primary">
                      {usersQuery.data?.length ?? "…"} account
                      {usersQuery.data?.length !== 1 ? "s" : ""}
                    </span>
                  </div>
                  <h4 className="mt-3 text-base font-bold text-ink transition-colors group-hover:text-primary">
                    Users
                  </h4>
                  <p className="mt-1 text-xs text-ink-soft">
                    Add admins &amp; editors, update passwords, manage roles
                  </p>
                </Link>
              )}

              {canManageUsers && (
                <Link
                  href="/admin/audit"
                  className="group rounded-2xl border-2 border-dashed border-primary/40 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/70 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-lighter text-primary transition-colors group-hover:bg-primary/10">
                      <ScrollText className="h-5 w-5" />
                    </span>
                    <span className="rounded-full bg-primary-lighter px-2 py-0.5 text-[10px] font-bold text-primary">
                      ACTIVITY
                    </span>
                  </div>
                  <h4 className="mt-3 text-base font-bold text-ink transition-colors group-hover:text-primary">
                    Audit Log
                  </h4>
                  <p className="mt-1 text-xs text-ink-soft">
                    Who created, updated, deleted or approved records
                  </p>
                </Link>
              )}

              {canManageDeleted && (
                <Link
                  href="/admin/deleted"
                  className="group rounded-2xl border-2 border-dashed border-secondary/40 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-secondary/70 hover:shadow-md"
                >
                  <div className="flex items-start justify-between">
                    <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-secondary-light text-secondary transition-colors group-hover:bg-secondary/10">
                      <Trash2 className="h-5 w-5" />
                    </span>
                    {deletedQuery.data?.total ? (
                      <span className="rounded-full bg-secondary-light px-2 py-0.5 text-[10px] font-bold text-secondary">
                        {deletedQuery.data.total}
                      </span>
                    ) : (
                      <span className="rounded-full bg-mist px-2 py-0.5 text-[10px] font-bold text-ink-soft">
                        EMPTY
                      </span>
                    )}
                  </div>
                  <h4 className="mt-3 text-base font-bold text-ink transition-colors group-hover:text-secondary">
                    Deleted Data
                  </h4>
                  <p className="mt-1 text-xs text-ink-soft">
                    Restore or permanently delete hidden rows
                  </p>
                </Link>
              )}
        </div>
      </div>
    </div>
  );
}
