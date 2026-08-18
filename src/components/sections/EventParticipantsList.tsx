"use client";

import { eventParticipants, type EventParticipantItem } from "@/data/eventParticipants";
import { useTable } from "@/lib/api";
import { GraduationCap, School, Users } from "lucide-react";

export default function EventParticipantsList({
  eventId,
}: {
  eventId: string;
}) {
  const [items] = useTable<EventParticipantItem>("eventparticipants", eventParticipants);

  const participants = items.filter(
    (p) => p.status === "approved" && String(p.eventId) === String(eventId),
  );

  if (participants.length === 0) return null;

  return (
    <div className="mt-16">
      <h2 className="text-2xl font-bold text-ink">Participants</h2>
      <p className="mt-1 text-sm text-ink-soft">
        {participants.length} verified participant
        {participants.length !== 1 ? "s" : ""} for this event.
      </p>
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {participants.map((p) => (
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
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}