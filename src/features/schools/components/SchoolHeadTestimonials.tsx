"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { SkeletonEventCard } from "@/components/common/Skeleton";
import { schools, type SchoolItem } from "@/features/schools/data/schools";
import { useTable } from "@/lib/api";
import { safeImage } from "@/lib/imageUrl";
import { Quote } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function SchoolHeadTestimonials() {
  const [items, loading] = useTable<SchoolItem>("schools", schools);

  const partners = (items as SchoolItem[]).filter(
    (s) =>
      String(s.status) === "published" &&
      String(s.testimonialApproved) === "true" &&
      String(s.consentStatus) === "granted" &&
      (s.headName || s.headTestimonial),
  );

  return (
    <section id="school-partners" className="section-anchor bg-gradient-admin-subtle py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="School Partners"
          title="Words from Our"
          accent="School Partners"
          description="Feedback and testimonials from the school heads who host our Cyber Awareness Seminars — shared with their consent."
        />

        {loading ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            <SkeletonEventCard />
            <SkeletonEventCard />
            <SkeletonEventCard />
          </div>
        ) : partners.length === 0 ? (
          <div className="col-span-full rounded-3xl border-2 border-primary/20 bg-white p-16 text-center">
            <Quote className="mx-auto mb-3 h-10 w-10 text-primary/40" />
            <p className="text-sm font-medium text-ink-soft">
              School partner testimonies will appear here once they are
              approved and shared with consent.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {partners.map((school, i) => (
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
                  <Hoverable className="group relative h-full rounded-3xl bg-linear-to-br from-primary/40 via-primary/10 to-secondary/40 p-px shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/20">
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-white p-6">
                      <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-secondary/20" />
                      <span className="absolute top-5 right-5 text-primary/15">
                        <Quote className="h-9 w-9" />
                      </span>

                      <h3 className="pr-10 text-base font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                        {school.name}
                      </h3>

                      {school.headTestimonial ? (
                        <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                          &ldquo;{school.headTestimonial}&rdquo;
                        </p>
                      ) : (
                        <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                          A heartfelt thank you to TechPunno for empowering our
                          students with cyber awareness.
                        </p>
                      )}

                      <div className="mt-5 flex items-center gap-3 border-t border-primary/15 pt-4">
                        {safeImage(school.headImage) ? (
                          <span className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30">
                            <Image
                              src={safeImage(school.headImage)!}
                              alt={school.headName || school.name}
                              fill
                              sizes="40px"
                              className="object-cover"
                              unoptimized
                            />
                          </span>
                        ) : (
                          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-gradient-admin text-sm font-bold text-white">
                            {(school.headName || school.name).charAt(0)}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-ink">
                            {school.headName || "School Head"}
                          </p>
                          <p className="mt-0.5 truncate text-xs text-ink-soft">
                            {school.headDesignation || "Headmaster"} ·{" "}
                            {school.district}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Hoverable>
                </Link>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/schools"
            className="inline-flex items-center gap-2 rounded-full bg-gradient-admin px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-transform hover:-translate-y-0.5"
          >
            Explore the School Network
          </Link>
        </div>
      </Container>
    </section>
  );
}