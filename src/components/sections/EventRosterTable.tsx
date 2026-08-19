"use client";

import { api } from "@/lib/api";
import { Check, X } from "lucide-react";
import { useEffect, useState } from "react";

interface RosterRow {
  fullName: string;
  className: string;
  institution: string;
  registered: boolean;
  participated: boolean;
}

function YesNoBadge({ value }: { value: boolean }) {
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-bold ${
        value
          ? "bg-primary-lighter text-primary"
          : "bg-mist text-ink-soft"
      }`}
    >
      {value ? <Check className="h-3 w-3" /> : <X className="h-3 w-3" />}
      {value ? "Yes" : "No"}
    </span>
  );
}

export default function EventRosterTable({ eventId }: { eventId: string }) {
  const [rows, setRows] = useState<RosterRow[] | null>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .eventRoster(eventId)
      .then((data) => {
        if (!cancelled) setRows(data);
      })
      .catch(() => {
        if (!cancelled) setRows([]);
      });
    return () => {
      cancelled = true;
    };
  }, [eventId]);

  const counts = rows
    ? {
        registered: rows.filter((r) => r.registered).length,
        participated: rows.filter((r) => r.participated).length,
      }
    : { registered: 0, participated: 0 };

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-ink">Registration &amp; Participation</h2>
      {rows && rows.length > 0 && (
        <p className="mt-1 text-sm text-ink-soft">
          {rows.length} student{rows.length !== 1 ? "s" : ""} registered for this
          event, {counts.participated} confirmed as participants.
        </p>
      )}

      {rows === null ? (
        <div className="mt-6 overflow-hidden rounded-2xl border-2 border-primary/20 bg-white shadow-sm">
          <div className="grid grid-cols-5 gap-4 bg-linear-to-r from-[#1a3a68] to-primary px-5 py-3.5 text-[11px] font-bold tracking-wider text-white/85 uppercase">
            {["Full Name", "Class", "Institution", "Registered", "Participated"].map(
              (h) => (
                <span key={h}>{h}</span>
              ),
            )}
          </div>
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="grid grid-cols-5 gap-4 border-t border-ink/5 px-5 py-3.5"
            >
              {[0, 1, 2].map((j) => (
                <span key={j} className="h-3.5 animate-pulse rounded bg-mist" />
              ))}
              <span className="h-5 w-14 animate-pulse rounded-full bg-mist" />
              <span className="h-5 w-14 animate-pulse rounded-full bg-mist" />
            </div>
          ))}
        </div>
      ) : rows.length === 0 ? (
        <p className="mt-6 rounded-2xl border-2 border-dashed border-primary/30 bg-white p-10 text-center text-sm text-ink-soft">
          No registrations yet. Be the first to register for this event.
        </p>
      ) : (
        <div className="mt-6 overflow-hidden rounded-2xl border-2 border-primary/20 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-linear-to-r from-[#1a3a68] to-primary text-white">
                  {["#", "Full Name", "Class", "Institution", "Registered", "Participated"].map(
                    (h, i) => (
                      <th
                        key={h}
                        className={`px-5 py-3.5 text-[11px] font-bold tracking-wider whitespace-nowrap text-white/85 uppercase ${
                          i > 0 ? "" : "w-10"
                        }`}
                      >
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {rows.map((row, idx) => (
                  <tr
                    key={`${row.fullName}-${idx}`}
                    className="border-t border-ink/10 transition-colors odd:bg-white even:bg-mist/30 hover:bg-primary-lighter/40"
                  >
                    <td className="px-5 py-3 text-ink-soft">{idx + 1}</td>
                    <td className="px-5 py-3 font-semibold text-ink">
                      {row.fullName}
                    </td>
                    <td className="px-5 py-3 text-ink">{row.className}</td>
                    <td className="px-5 py-3 text-ink">{row.institution}</td>
                    <td className="px-5 py-3">
                      <YesNoBadge value={row.registered} />
                    </td>
                    <td className="px-5 py-3">
                      <YesNoBadge value={row.participated} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}