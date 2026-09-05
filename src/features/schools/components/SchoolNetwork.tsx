"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { SkeletonEventCard } from "@/components/common/Skeleton";
import { schools, type SchoolItem } from "@/features/schools/data/schools";
import { useTable } from "@/lib/api";
import { safeImage } from "@/lib/imageUrl";
import { getDateParts } from "@/lib/utils";
import { MapPin, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SchoolNetwork() {
  const [items, loading] = useTable<SchoolItem>("schools", schools);
  const published = items.filter(
    (s) => String(s.status) === "published",
  ) as SchoolItem[];

  return (
    <section id="school-network" className="section-anchor bg-gradient-admin-subtle py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="School Network"
          title="Our School"
          accent="Partners"
          description="The schools where TechPunno has successfully hosted Cyber Awareness Seminars. Each school is a trusted partner in building a safer digital society."
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonEventCard />
            <SkeletonEventCard />
            <SkeletonEventCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((school, i) => {
              const { day, month, year } = getDateParts(school.seminarDate);
              const logo = safeImage(school.logo);
              return (
                <Reveal
                  key={school.id}
                  variant={i % 2 === 0 ? "fade-up" : "zoom"}
                  delay={(i % 3) * 120}
                  className="h-full"
                >
                  <Link
                    href={`/schools/${school.slug || school.id}`}
                    className="block h-full"
                  >
                    <Hoverable className="group relative h-full rounded-3xl bg-linear-to-br from-primary/60 via-primary/10 to-secondary/50 p-px shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/20">
                      <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-white">
                        <div className="pointer-events-none absolute -right-12 -top-12 z-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-secondary/20" />
                        <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-linear-to-r from-primary via-secondary to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="relative h-44 shrink-0 overflow-hidden bg-mist">
                          {logo ? (
                            <Image
                              src={logo}
                              alt={school.name}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              unoptimized
                            />
                          ) : (
                            <div className="absolute inset-0 bg-linear-to-br from-primary to-primary-dark" />
                          )}
                          <div className="absolute inset-0 bg-linear-to-t from-white/50 via-transparent to-black/10" />
                          <span className="absolute right-4 top-4 rounded-full bg-primary px-3 py-1 text-[11px] font-bold text-white shadow-lg">
                            {school.badge || "Seminar Completed"}
                          </span>
                        </div>

                        <div className="relative flex flex-1 flex-col p-6">
                          <h3 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                            {school.name}
                          </h3>
                          <p className="mt-2 inline-flex items-center gap-1.5 text-sm text-ink-soft">
                            <MapPin className="h-4 w-4 text-primary" />
                            {school.district}
                            {school.upazila ? `, ${school.upazila}` : ""}
                          </p>
                          <div className="mt-5 grid grid-cols-2 gap-3 border-t border-ink/10 pt-4">
                            <div className="rounded-xl bg-mist/70 p-3 text-center">
                              <span className="block text-xl font-extrabold text-primary">
                                {day}
                              </span>
                              <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                                {month} {year}
                              </span>
                            </div>
                            <div className="rounded-xl bg-mist/70 p-3 text-center">
                              <span className="block text-xl font-extrabold text-primary">
                                {school.participants}
                              </span>
                              <span className="block text-[11px] font-semibold uppercase tracking-wider text-ink-soft">
                                Participants
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Hoverable>
                  </Link>
                </Reveal>
              );
            })}
            {(published.length === 0) && (
              <div className="col-span-full rounded-3xl border-2 border-primary/20 bg-white p-16 text-center">
                <Users className="mx-auto mb-3 h-10 w-10 text-primary/40" />
                <p className="text-sm font-medium text-ink-soft">
                  No schools have been added to the network yet.
                </p>
              </div>
            )}
          </div>
        )}
      </Container>
    </section>
  );
}