"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import CourseEnroll from "@/features/courses/components/CourseEnroll";
import { SkeletonCourseCard } from "@/components/common/Skeleton";
import { courses, type CourseItem } from "@/features/courses/data/courses";
import { useTable } from "@/lib/api";
import { firstImage } from "@/lib/imageUrl";
import { CalendarClock, Clock, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  open: "bg-primary-lighter text-primary",
  upcoming: "bg-amber-50 text-amber-600",
  completed: "bg-mist text-ink-soft",
};

export default function Courses() {
  const [items] = useTable<CourseItem>("courses", courses);

  return (
    <section id="courses" className="section-anchor bg-cream py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Courses"
          title="Learn new skills with"
          accent="TechPunno"
          description="Free hands-on courses that build digital literacy, cyber awareness and coding skills for students."
        />

        {items.length === 0 ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCourseCard />
            <SkeletonCourseCard />
            <SkeletonCourseCard />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {items.map((course, i) => (
              <Reveal
                key={course.id}
                variant={i % 2 === 0 ? "fade-up" : "zoom"}
                delay={(i % 3) * 120}
                className="h-full"
              >
                <Hoverable className="group relative h-full rounded-3xl bg-linear-to-br from-primary/60 via-primary/10 to-secondary/50 p-px shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/20">
                    <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-white">
                      <div className="pointer-events-none absolute -right-12 -top-12 z-0 h-36 w-36 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-secondary/20" />
                      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-linear-to-r from-primary via-secondary to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                      <Link
                        href={`/courses/${course.slug || course.id}`}
                        className="flex h-full flex-1 flex-col"
                      >
                        <div className="relative h-44 shrink-0 overflow-hidden">
                          {firstImage(course) ? (
                            <Image
                              src={firstImage(course)}
                              alt={course.title}
                              fill
                              sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-linear-to-br from-primary via-primary-dark to-[#06402a]" />
                          )}
                          <div className="absolute inset-0 bg-linear-to-t from-white/40 via-transparent to-black/10" />
                          <span
                            className={`absolute top-4 left-4 rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide shadow-sm backdrop-blur ${statusStyles[course.status] ?? "bg-mist text-ink-soft"}`}
                          >
                            {course.status}
                          </span>
                          <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-primary shadow-sm backdrop-blur">
                            {course.category}
                          </span>
                        </div>

                        <div className="relative flex flex-1 flex-col p-6">
                          <h3 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                            {course.title}
                          </h3>
                          <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                            {course.summary}
                          </p>
                          <div className="mt-4 grid grid-cols-1 gap-2 text-xs text-ink-soft">
                            <p className="inline-flex items-center gap-2 rounded-lg bg-cream px-3 py-2">
                              <Clock className="h-3.5 w-3.5 text-primary" />
                              {course.duration}
                            </p>
                            <p className="inline-flex items-center gap-2 rounded-lg bg-cream px-3 py-2">
                              <CalendarClock className="h-3.5 w-3.5 text-primary" />
                              {course.schedule}
                            </p>
                            <p className="inline-flex items-center gap-2 rounded-lg bg-cream px-3 py-2">
                              <Wallet className="h-3.5 w-3.5 text-primary" />
                              {course.fees}
                            </p>
                          </div>
                        </div>
                      </Link>
                      {course.status === "open" && (
                        <div className="border-t border-ink/10 px-6 pt-4 pb-6">
                          <CourseEnroll course={course} compact />
                        </div>
                      )}
                    </div>
                  </Hoverable>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}