"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { SkeletonEventCard } from "@/components/common/Skeleton";
import { type EventItem } from "@/features/events/data/events";
import { useTable } from "@/lib/api";
import { firstImage } from "@/lib/imageUrl";
import { getDateParts } from "@/lib/utils";
import { CalendarCheck, UserPlus } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

const filters = [
  { key: "all", label: "All Events" },
  { key: "upcoming", label: "Upcoming" },
  { key: "done", label: "Completed" },
];

export default function Events() {
  const router = useRouter();
  const [filter, setFilter] = useState<string>("all");
  const [items, loading] = useTable<EventItem>("events", []);

  const filtered = [...(filter === "all" ? items : items.filter((event) => event.status === filter))].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
  );

  const goToRegister = (event: EventItem, action: "register" | "participate") => {
    router.push(`/events/${event.slug || event.id}?action=${action}#register-participate`);
  };

  return (
    <section id="events" className="section-anchor bg-gradient-admin-subtle py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Events"
          title="Workshops, Webinars &"
          accent="Campaigns"
          description="Hands-on programs that bring cyber awareness and digital literacy to communities across Bangladesh."
        />

        <Reveal className="mb-10 flex flex-wrap items-center justify-center gap-2">
          {filters.map((f) => (
            <Hoverable key={f.key}>
            <button
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                filter === f.key
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-ink/5 text-ink-soft hover:bg-primary-lighter hover:text-primary"
              }`}
            >
              {f.label}
            </button>
            </Hoverable>
          ))}
        </Reveal>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonEventCard />
            <SkeletonEventCard />
            <SkeletonEventCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((event: EventItem, i) => {
              const { day, month, year } = getDateParts(event.date);
              return (
                <Reveal
                  key={event.id}
                  variant={i % 2 === 0 ? "fade-up" : "zoom"}
                  delay={(i % 3) * 120}
                  className="h-full"
                >
                <Link
                  href={`/events/${event.slug || event.id}`}
                  className="block h-full"
                >
                  <Hoverable className="group relative h-full rounded-3xl bg-linear-to-br from-primary/60 via-primary/10 to-secondary/50 p-px shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/20">
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-white">
                      <div className="pointer-events-none absolute -right-12 -top-12 z-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-secondary/20" />
                      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-linear-to-r from-primary via-secondary to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <div className="relative h-44 shrink-0 overflow-hidden">
                        <Image
                          src={firstImage(event) || "/images/dummy.jpeg"}
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-linear-to-t from-white/50 via-transparent to-black/10" />
                        <div className="absolute right-4 top-4 rounded-2xl bg-ink/70 px-5 py-2 text-center text-white shadow-lg backdrop-blur-md">
                          <span className="block text-2xl font-extrabold leading-none">
                            {day}
                          </span>
                          <span className="block text-xs font-semibold uppercase tracking-widest">
                            {month} {year}
                          </span>
                        </div>
                      </div>

                      <div className="relative flex flex-1 flex-col p-6">
                        <div className="mb-3 flex flex-wrap items-center gap-2">
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-lighter px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                            <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                            {event.category}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                              event.mode === "Offline"
                                ? "bg-secondary-light text-secondary"
                                : "bg-purple-50 text-purple-600"
                            }`}
                          >
                            {event.mode}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                          {event.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                          {event.summary}
                        </p>
                        <div className="mt-5 flex items-center justify-between border-t border-ink/10 pt-4">
                          <span className="inline-flex items-center gap-1.5 text-sm font-medium text-ink-soft">
                            <svg
                              width="15"
                              height="15"
                              viewBox="0 0 24 24"
                              fill="none"
                              stroke="currentColor"
                              strokeWidth="2"
                              strokeLinecap="round"
                              strokeLinejoin="round"
                            >
                              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                              <circle cx="12" cy="10" r="3" />
                            </svg>
                            {event.location}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-bold ${
                              event.status === "upcoming"
                                ? "bg-primary-lighter text-primary"
                                : "bg-mist text-ink-soft"
                            }`}
                          >
                            {event.status === "upcoming"
                              ? "Register Open"
                              : "Completed"}
                          </span>
                        </div>
                        {event.status === "upcoming" && (
                          <div className="mt-4 flex gap-2">
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                goToRegister(event, "register");
                              }}
                              className="cursor-pointer inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-primary px-2.5 py-2.5 text-xs font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark"
                            >
                              <CalendarCheck className="h-4 w-4" />
                              Register
                            </button>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                goToRegister(event, "participate");
                              }}
                              className="cursor-pointer inline-flex flex-1 items-center justify-center gap-1.5 rounded-xl border-2 border-primary/40 bg-white px-2.5 py-2.5 text-xs font-semibold text-primary transition-all hover:bg-primary-lighter"
                            >
                              <UserPlus className="h-4 w-4" />
                              Participate
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Hoverable>
                </Link>
              </Reveal>
              );
            })}
          </div>
        )}
      </Container>
    </section>
  );
}

