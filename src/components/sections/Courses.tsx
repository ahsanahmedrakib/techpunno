"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import CourseEnroll from "@/components/sections/CourseEnroll";
import { SkeletonCourseCard } from "@/components/common/Skeleton";
import { courses, type CourseItem } from "@/data/courses";
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
                <Link
                  href={`/courses/${course.slug || course.id}`}
                  className="block h-full"
                >
                  <Hoverable className="group relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-primary/40 bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:border-primary hover:shadow-2xl hover:shadow-primary/10">
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
                      <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
                      <span
                        className={`absolute top-4 left-4 rounded-full px-3.5 py-1 text-[11px] font-bold uppercase tracking-wide ${statusStyles[course.status] ?? "bg-mist text-ink-soft"}`}
                      >
                        {course.status}
                      </span>
                      <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-primary backdrop-blur">
                        {course.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                        {course.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                        {course.summary}
                      </p>
                      <div className="mt-4 space-y-1.5 text-xs text-ink-soft">
                        <p className="flex items-center gap-2">
                          <Clock className="h-3.5 w-3.5 text-primary" />
                          {course.duration}
                        </p>
                        <p className="flex items-center gap-2">
                          <CalendarClock className="h-3.5 w-3.5 text-primary" />
                          {course.schedule}
                        </p>
                        <p className="flex items-center gap-2">
                          <Wallet className="h-3.5 w-3.5 text-primary" />
                          {course.fees}
                        </p>
                      </div>
                      {course.status === "open" && (
                        <div className="mt-5 flex items-center gap-2 border-t border-ink/5 pt-4">
                          <CourseEnroll course={course} compact />
                        </div>
                      )}
                    </div>
                  </Hoverable>
                </Link>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}