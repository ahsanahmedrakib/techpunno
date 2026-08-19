"use client";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import CourseEnroll from "@/features/courses/components/CourseEnroll";
import { type CourseItem } from "@/features/courses/data/courses";
import { firstImage } from "@/lib/imageUrl";
import { CalendarClock, CheckCircle2, Clock, Wallet } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const statusStyles: Record<string, string> = {
  open: "bg-emerald-500/80",
  upcoming: "bg-amber-500/80",
  completed: "bg-white/15",
};

export default function CourseDetail({ item }: { item: CourseItem }) {
  const isOpen = item.status === "open";

  return (
    <Container className="py-20">
      <Reveal variant="fade-left">
        <Link
          href="/#courses"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          <span className="transition-transform group-hover:-translate-x-0.5">←</span>
          Back to Courses
        </Link>
      </Reveal>

      <Reveal delay={80}>
        <header className="relative mt-6 overflow-hidden rounded-3xl border-2 border-primary/30 bg-white shadow-xl shadow-ink/10">
          <div className="absolute inset-0 bg-linear-to-br from-[#1a3a68] via-primary to-primary-dark" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-secondary/20 blur-2xl" />

          <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[1fr_auto] lg:items-center">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                  {item.category}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm ${statusStyles[item.status] ?? "bg-white/15"}`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {item.status}
                </span>
              </div>
              <h1 className="mt-6 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                {item.title}
              </h1>
              <p className="mt-4 max-w-2xl text-base leading-relaxed text-white/85">
                {item.summary}
              </p>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/90">
                <span className="inline-flex items-center gap-2">
                  <Clock className="h-4 w-4 text-secondary-light" />
                  {item.duration}
                </span>
                <span className="inline-flex items-center gap-2">
                  <CalendarClock className="h-4 w-4 text-secondary-light" />
                  {item.schedule}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Wallet className="h-4 w-4 text-secondary-light" />
                  {item.fees}
                </span>
              </div>
            </div>

            {firstImage(item) && (
              <div className="lg:pl-10">
                <div className="relative h-40 w-40 overflow-hidden rounded-3xl border-2 border-white/25">
                  <Image
                    src={firstImage(item)}
                    alt={item.title}
                    fill
                    sizes="160px"
                    className="object-cover"
                  />
                </div>
              </div>
            )}
          </div>
        </header>
      </Reveal>

      <Reveal delay={240} className="min-w-0 mt-10">
        <div className="min-w-0 overflow-hidden rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-sm sm:p-8">
          <div
            className="prose prose-lg max-w-none text-ink-soft prose-headings:text-ink prose-a:text-primary prose-strong:text-ink prose-img:rounded-2xl prose-video:rounded-2xl wrap-anywhere [&_img]:max-w-full [&_pre]:max-w-full [&_pre]:whitespace-pre-wrap [&_pre]:wrap-break-word [&_code]:wrap-break-word [&_table]:max-w-full"
            dangerouslySetInnerHTML={{ __html: item.description }}
          />
        </div>
      </Reveal>

      {isOpen && (
        <Reveal delay={320}>
          <div className="mt-12 overflow-hidden rounded-3xl border-2 border-primary/40 bg-white p-8 text-center shadow-2xl shadow-primary/10 sm:p-12">
            <p className="text-xs font-bold uppercase tracking-widest text-primary">
              Enrollment is open
            </p>
            <h2 className="mt-3 text-2xl font-extrabold text-ink sm:text-3xl">
              Enroll in this course
            </h2>
            <p className="mx-auto mt-3 max-w-lg text-sm leading-relaxed text-ink-soft">
              Seats are limited. Fill the enrollment form and our team will
              confirm your admission.
            </p>
            <div className="mt-7 flex justify-center">
              <CourseEnroll course={item} />
            </div>
          </div>
        </Reveal>
      )}
    </Container>
  );
}