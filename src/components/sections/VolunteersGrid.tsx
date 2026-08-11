"use client";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import Skeleton from "@/components/common/Skeleton";
import { safeImage } from "@/lib/imageUrl";
import { api, type PagedResult } from "@/lib/api";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import {
  Building2,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  HeartHandshake,
  Search,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

interface VolunteerRow {
  id: string;
  fullName?: string;
  institute?: string;
  educationLevel?: string;
  membershipType?: string;
  image?: string;
  status?: string;
  createdAt?: string;
}

const PAGE_SIZE = 30;

function getPageItems(page: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const candidates = new Set([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...candidates]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
  const items: (number | string)[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push(`ellipsis-${p}`);
    items.push(p);
    prev = p;
  }
  return items;
}

export default function VolunteersGrid() {
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [page, setPage] = useState(1);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedSearch(search.trim()), 350);
    return () => clearTimeout(t);
  }, [search]);

  const { data, isFetching, isPlaceholderData } = useQuery({
    queryKey: ["volunteers", "approved", page, debouncedSearch],
    placeholderData: keepPreviousData,
    queryFn: async () =>
      api.paged<VolunteerRow>("volunteers", {
        page,
        pageSize: PAGE_SIZE,
        search: debouncedSearch || undefined,
        filterField: "status",
        filterValue: "approved",
      }),
  });

  const { docs, total, totalPages } = useMemo<PagedResult<VolunteerRow>>(
    () =>
      data ?? {
        docs: [],
        total: 0,
        page: 1,
        pageSize: PAGE_SIZE,
        totalPages: 0,
      },
    [data],
  );

  const from = total === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const to = Math.min(page * PAGE_SIZE, total);

  return (
    <section id="volunteers" className="section-anchor bg-cream py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Our Family"
          title="Meet our"
          accent="volunteers"
          description="The passionate people building a safer digital society. Every member shown here is verified and approved by our team."
        />

        <div className="relative mx-auto mb-10 max-w-md">
          <Search className="pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2 text-ink-soft/50" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by name or institution..."
            className="w-full rounded-3xl border-2 border-primary/30 bg-white py-3 pr-4 pl-11 text-sm text-ink shadow-sm outline-none transition-all placeholder:text-ink-soft/50 focus:border-primary focus:ring-4 focus:ring-primary/10"
          />
        </div>

        {isFetching && !docs.length ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-ink/5 bg-white p-6 shadow-sm"
              >
                <Skeleton className="mx-auto mb-4 h-20 w-20 rounded-full" />
                <Skeleton className="mx-auto mb-2 h-5 w-2/3" />
                <Skeleton className="mx-auto mb-2 h-4 w-1/2" />
                <Skeleton className="mx-auto h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : total === 0 && !debouncedSearch ? (
          <div className="mx-auto max-w-lg rounded-3xl border-2 border-dashed border-primary/30 bg-white p-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-lighter text-primary">
              <HeartHandshake className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-ink">
              No approved volunteers yet
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              Once registrations are verified and approved by the team, they
              will appear here. Register below to become the first!
            </p>
          </div>
        ) : total === 0 ? (
          <div className="mx-auto max-w-lg rounded-3xl border-2 border-dashed border-primary/30 bg-white p-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-mist text-ink-soft/40">
              <Search className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-ink">No matches found</h3>
            <p className="mt-2 text-sm text-ink-soft">
              No volunteer matches &quot;{debouncedSearch}&quot;. Try another
              name or institution.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {docs.map((member, i) => (
                <Reveal
                  key={member.id}
                  variant={i % 2 === 0 ? "fade-up" : "zoom"}
                  delay={(i % 3) * 100}
                  className="group relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
                >
                  <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-primary-lighter/70 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
                  <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-primary/30 bg-linear-to-br from-primary to-primary-dark shadow-lg shadow-primary/20">
                    {safeImage(member.image) ? (
                      <Image
                        src={safeImage(member.image)}
                        alt={member.fullName ?? "Volunteer"}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center text-2xl font-extrabold text-white">
                        {(member.fullName ?? "V")
                          .trim()
                          .charAt(0)
                          .toUpperCase()}
                      </div>
                    )}
                  </div>
                  <h3 className="text-base font-bold text-ink">
                    {member.fullName}
                  </h3>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary-lighter px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
                    <HeartHandshake className="h-3 w-3" />
                    {member.membershipType ?? "Volunteer"}
                  </span>
                  <div className="mt-4 space-y-1.5">
                    <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-ink-soft">
                      <Building2 className="h-4 w-4 shrink-0 text-primary" />
                      <span className="truncate">{member.institute}</span>
                    </p>
                    <p className="flex items-center justify-center gap-1.5 text-xs font-semibold text-ink-soft/70">
                      <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                      {member.educationLevel ?? "Member"}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="mt-12 flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="font-medium text-sm text-ink-soft">
                  Showing {from}-{to} of {total} volunteers
                </div>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setPage(page - 1)}
                    disabled={page <= 1 || isPlaceholderData}
                    className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-ink/10 bg-white text-ink transition-all hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Previous page"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  {getPageItems(page, totalPages).map((item) =>
                    typeof item === "string" ? (
                      <span
                        key={item}
                        className="grid h-9 min-w-5 place-items-center px-1 text-xs text-ink-soft/50"
                      >
                        …
                      </span>
                    ) : (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setPage(item)}
                        className={`grid h-9 min-w-9 cursor-pointer place-items-center rounded-lg px-2 text-sm font-semibold transition-all ${
                          item === page
                            ? "bg-primary text-white shadow-md shadow-primary/30"
                            : "border border-ink/10 bg-white text-ink hover:border-primary/50 hover:text-primary"
                        }`}
                      >
                        {item}
                      </button>
                    ),
                  )}
                  <button
                    type="button"
                    onClick={() => setPage(page + 1)}
                    disabled={page >= totalPages || isPlaceholderData}
                    className="grid h-9 w-9 cursor-pointer place-items-center rounded-lg border border-ink/10 bg-white text-ink transition-all hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
                    aria-label="Next page"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </Container>
    </section>
  );
}

