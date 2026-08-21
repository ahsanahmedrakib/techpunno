"use client";

import type { TableConfig } from "@/lib/tables";
import { api } from "@/lib/api";
import { formatDateAndTime } from "@/lib/utils";
import { useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

interface ServiceRequestDetailProps {
  row: Record<string, unknown>;
  config: TableConfig;
}

const statusColors: Record<string, string> = {
  Pending: "bg-amber-100 text-amber-700 border-amber-200",
  Reviewing: "bg-blue-100 text-blue-700 border-blue-200",
  Contacted: "bg-purple-100 text-purple-700 border-purple-200",
  "In Progress": "bg-indigo-100 text-indigo-700 border-indigo-200",
  Completed: "bg-green-100 text-green-700 border-green-200",
  Cancelled: "bg-red-100 text-red-700 border-red-200",
};

export default function ServiceRequestDetail({
  row,
  config,
}: ServiceRequestDetailProps) {
  const [updating, setUpdating] = useState(false);
  const qc = useQueryClient();
  const currentStatus = String(row.status || "Pending");

  const handleStatusChange = async (newStatus: string) => {
    setUpdating(true);
    try {
      await api.update("servicerequests", String(row.id), {
        status: newStatus,
      });
      await qc.invalidateQueries({
        queryKey: ["table", "servicerequests"],
      });
      toast.success(`Status updated to "${newStatus}"`);
      row.status = newStatus as never;
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to update status",
      );
    } finally {
      setUpdating(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/servicerequests"
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-primary/30 bg-white px-4 py-2 text-sm font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter/50 hover:text-primary shadow-sm"
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </Link>
        <h2 className="text-lg font-bold text-ink">
          {config.singular} Detail
        </h2>
        {typeof row.requestId === "string" && row.requestId && (
          <span className="rounded-lg bg-primary-lighter px-3 py-1 text-sm font-bold text-primary">
            {String(row.requestId)}
          </span>
        )}
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="space-y-6 lg:col-span-2">
          <div className="rounded-2xl border-2 border-primary/40 bg-white p-6 shadow-sm">
            <div className="space-y-0">
              {config.fields.map((field, idx) => {
                const value = row[field.name];
                if (value === undefined || value === null || value === "")
                  return null;
                if (field.name === "status") return null;

                return (
                  <div
                    key={field.name}
                    className={`py-4 ${
                      idx !== config.fields.length - 1
                        ? "border-b border-ink/5"
                        : ""
                    }`}
                  >
                    <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
                      {field.label}
                    </p>
                    {field.type === "textarea" || field.type === "list" ? (
                      <div className="whitespace-pre-wrap rounded-xl bg-cream/50 p-3 text-sm leading-relaxed text-ink">
                        {Array.isArray(value)
                          ? value.join("\n")
                          : String(value)}
                      </div>
                    ) : field.name === "createdAt" ||
                      field.name === "updatedAt" ? (
                      <p className="rounded-xl bg-cream/50 px-3 py-2 text-sm text-ink">
                        {formatDateAndTime(String(value))}
                      </p>
                    ) : (
                      <p className="rounded-xl bg-cream/50 px-3 py-2 text-sm text-ink">
                        {String(value)}
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border-2 border-primary/40 bg-white p-6 shadow-sm">
            <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink-soft/60">
              Status
            </h3>
            <div className="mb-4">
              <span
                className={`inline-flex rounded-full border px-3 py-1.5 text-sm font-semibold ${statusColors[currentStatus] || "bg-gray-100 text-gray-700 border-gray-200"}`}
              >
                {currentStatus}
              </span>
            </div>
            <div className="space-y-2">
              {config.statusOptions?.map((status) => (
                <button
                  key={status}
                  onClick={() => handleStatusChange(status)}
                  disabled={updating || status === currentStatus}
                  className={`cursor-pointer w-full rounded-xl px-4 py-2.5 text-left text-sm font-medium transition-all ${
                    status === currentStatus
                      ? "border-2 border-primary bg-primary-lighter text-primary"
                      : "border border-ink/10 bg-white text-ink-soft hover:border-primary/30 hover:bg-primary-lighter/50 hover:text-primary"
                  } disabled:cursor-not-allowed disabled:opacity-50`}
                >
                  {status}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
