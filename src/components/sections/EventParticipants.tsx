"use client";

import { eventParticipants, type EventParticipantItem } from "@/data/eventParticipants";
import { useTable } from "@/lib/api";
import { GraduationCap, Phone, School, Search, Users } from "lucide-react";
import { useState } from "react";

export default function EventParticipants() {
  const [items] = useTable<EventParticipantItem>("eventparticipants", eventParticipants);
  const [query, setQuery] = useState("");

  const approved = items.filter((p) => p.status === "approved");
  const filtered = approved.filter((p) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return [p.fullName, p.mobile, p.institution, p.className, p.eventTitle]
      .join(" ")
      .toLowerCase()
      .includes(q);
  });

  return (
    <div className="mt-16">
      <h2 className="text-center text-2xl font-bold text-ink">
        Event Participants
      </h2>
      <p className="mx-auto mt-2 max-w-xl text-center text-sm text-ink-soft">
        Meet the students joining our workshops, webinars and campaigns.
      </p>

      <div className="relative mx-auto mt-6 max-w-md">
        <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by name, phone or institution..."
          className="w-full rounded-full border-2 border-primary/20 bg-white py-3 pr-4 pl-11 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-ink-soft/50 focus:border-primary focus:ring-4 focus:ring-primary/10"
        />
      </div>

      {approved.length === 0 ? (
        <p className="mt-8 rounded-2xl border-2 border-dashed border-primary/30 bg-white p-10 text-center text-sm text-ink-soft">
          No approved participants yet.
        </p>
      ) : filtered.length === 0 ? (
        <p className="mt-8 rounded-2xl border-2 border-dashed border-primary/30 bg-white p-10 text-center text-sm text-ink-soft">
          No participants match your search.
        </p>
      ) : (
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="flex items-start gap-3 rounded-2xl border-2 border-primary/20 bg-white p-4 shadow-sm transition-all hover:border-primary/50 hover:shadow-md"
            >
              <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary-lighter text-primary">
                <Users className="h-5 w-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-bold text-ink">{p.fullName}</p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft">
                  <GraduationCap className="h-3.5 w-3.5" />
                  {p.className}
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft">
                  <School className="h-3.5 w-3.5" />
                  <span className="truncate">{p.institution}</span>
                </p>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-ink-soft/80">
                  <Phone className="h-3.5 w-3.5" />
                  {p.mobile}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}