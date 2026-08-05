"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import SectionHeading from "@/components/common/SectionHeading";
import SkeletonEventCard from "@/components/common/Skeleton";
import { events, type EventItem } from "@/data/events";
import { useTable } from "@/lib/api";
import { fadeUp, scaleIn, stagger } from "@/lib/motion";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

const filters = [
  { key: "all", label: "All Events" },
  { key: "upcoming", label: "Upcoming" },
  { key: "done", label: "Completed" },
];

export default function Events() {
  const [filter, setFilter] = useState<string>("all");
  const [items, loading] = useTable<EventItem>("events", events);

  const filtered =
    filter === "all" ? items : items.filter((event) => event.status === filter);

  return (
    <section id="events" className="section-anchor bg-cream py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Events"
          title="Workshops, Webinars &"
          accent="Campaigns"
          description="Hands-on programs that bring cyber awareness and digital literacy to communities across Bangladesh."
        />

        <motion.div
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true }}
          className="mb-10 flex flex-wrap items-center justify-center gap-2"
        >
          {filters.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all ${
                filter === f.key
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "bg-ink/5 text-ink-soft hover:bg-primary-lighter hover:text-primary"
              }`}
            >
              {f.label}
            </button>
          ))}
        </motion.div>

        {loading && items.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonEventCard />
            <SkeletonEventCard />
            <SkeletonEventCard />
          </div>
        ) : (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          >
            <AnimatePresence mode="popLayout">
              {filtered.map((event: EventItem) => (
                <motion.article
                  key={event.id}
                  layout
                  variants={scaleIn}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: true }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="h-full"
                >
                  <Link
                    href={`/events/${event.slug || event.id}`}
                    className="block h-full"
                  >
                    <Hoverable className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-primary/40 bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:border-primary hover:shadow-2xl hover:shadow-primary/10">
                      <div className="relative h-44 shrink-0 overflow-hidden">
                        <Image
                          src={event.image || "/images/dummy.jpeg"}
                          alt={event.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                        <div className="absolute right-4 top-4 rounded-2xl bg-white/15 px-5 py-2 text-center text-white backdrop-blur-sm">
                          <span className="block text-2xl font-extrabold leading-none">
                            {event.date}
                          </span>
                          <span className="block text-xs font-semibold uppercase tracking-widest">
                            {event.month} {event.year}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-1 flex-col p-6">
                        <div className="mb-3 flex items-center gap-2">
                          <span className="rounded-full bg-primary-lighter px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                            {event.category}
                          </span>
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                              event.mode === "Offline"
                                ? "bg-secondary-light text-secondary"
                                : "bg-mist text-ink-soft"
                            }`}
                          >
                            {event.mode}
                          </span>
                        </div>
                        <h3 className="text-lg font-bold leading-snug text-ink">
                          {event.title}
                        </h3>
                        <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                          {event.description}
                        </p>
                        <div className="mt-5 flex items-center justify-between border-t border-ink/5 pt-4">
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
                      </div>
                    </Hoverable>
                  </Link>
                </motion.article>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </Container>
    </section>
  );
}

