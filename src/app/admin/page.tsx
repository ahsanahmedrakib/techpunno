"use client";

import Link from "next/link";
import { useQueries } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { collections, collectionKeys, type CollectionKey } from "@/lib/collections";

const icons: Record<CollectionKey, string> = {
  advisors: "👥",
  coreteam: "⭐",
  blogs: "📝",
  events: "📅",
  hero: "🏠",
  news: "📰",
  videos: "🎬",
  quizsets: "📋",
  contacts: "📬",
};

export default function AdminDashboard() {
  const results = useQueries({
    queries: collectionKeys.map((key) => ({
      queryKey: ["collection", key],
      queryFn: () => api.list(key),
    })),
  });

  const counts: Record<string, number> = {};
  const sources: Record<string, "db" | "error"> = {};
  collectionKeys.forEach((key, i) => {
    const r = results[i];
    if (r.status === "success" && r.data) {
      counts[key] = r.data.length;
      sources[key] = "db";
    } else if (r.status === "error") {
      counts[key] = 0;
      sources[key] = "error";
    } else {
      counts[key] = 0;
      sources[key] = "db";
    }
  });

  const totalRecords = Object.values(counts).reduce((a, b) => a + b, 0);
  const dbCount = Object.values(sources).filter((s) => s === "db").length;

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-lighter text-lg text-primary">
              📁
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
                Collections
              </p>
              <p className="mt-0.5 text-3xl font-bold text-ink">
                {collectionKeys.length}
              </p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-lighter text-lg text-primary">
              📄
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
                Total Records
              </p>
              <p className="mt-0.5 text-3xl font-bold text-ink">{totalRecords}</p>
            </div>
          </div>
        </div>
        <div className="rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-sm transition-all hover:shadow-md">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-lighter text-lg text-primary">
              🔗
            </span>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
                DB Connected
              </p>
              <p className="mt-0.5 text-3xl font-bold text-ink">
                {dbCount}/{collectionKeys.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div>
        <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink-soft/60">
          Manage Collections
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {collectionKeys.map((key) => {
            const col = collections[key];
            const count = counts[key] ?? 0;
            const src = sources[key] ?? "db";
            return (
              <Link
                key={key}
                href={`/admin/${key}`}
                className="group rounded-2xl border-2 border-primary/30 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/60 hover:shadow-md"
              >
                <div className="flex items-start justify-between">
                  <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-cream text-xl transition-colors group-hover:bg-primary-lighter">
                    {icons[key]}
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
                  {count} record{count !== 1 ? "s" : ""}
                  {col.readOnly && " · Read-only"}
                  {col.single && " · Single"}
                </p>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
