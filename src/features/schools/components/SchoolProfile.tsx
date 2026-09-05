import Container from "@/components/common/Container";
import ImageSwiper from "@/components/common/ImageSwiper";
import Reveal from "@/components/common/Reveal";
import type { SchoolItem } from "@/features/schools/data/schools";
import { safeImage, singleImageList } from "@/lib/imageUrl";
import { formatDate, getDateParts } from "@/lib/utils";
import {
  ArrowLeft,
  Award,
  BadgeCheck,
  Calendar,
  CheckCircle2,
  MapPin,
  Quote,
  ShieldCheck,
  User,
  Users,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

function Avatar({ src, alt }: { src?: string; alt: string }) {
  const image = safeImage(src);
  if (image) {
    return (
      <span className="relative h-14 w-14 shrink-0 overflow-hidden rounded-full ring-2 ring-primary/30">
        <Image
          src={image}
          alt={alt}
          fill
          sizes="56px"
          className="object-cover"
          unoptimized
        />
      </span>
    );
  }
  return (
    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-full bg-gradient-admin text-lg font-bold text-white">
      {alt.charAt(0)}
    </span>
  );
}

export default function SchoolProfile({ item }: { item: SchoolItem }) {
  const { day, month, year } = getDateParts(item.seminarDate);
  const photoList = singleImageList({
    images: item.images,
    cardImage: item.logo,
  } as { images?: string[]; cardImage?: string });

  return (
    <Container className="py-20">
      <Reveal variant="fade-left">
        <Link
          href="/schools"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to School Network
        </Link>
      </Reveal>

      <Reveal delay={80}>
        <header className="relative mt-6 overflow-hidden rounded-3xl border-2 border-primary/30 shadow-xl shadow-ink/10">
          <div className="absolute inset-0 bg-linear-to-br from-[#1a3a68] via-primary to-primary-dark" />
          <div className="pointer-events-none absolute -top-24 -right-24 h-72 w-72 rounded-full bg-white/10 blur-2xl" />
          <div className="pointer-events-none absolute -bottom-32 -left-16 h-72 w-72 rounded-full bg-secondary/20 blur-2xl" />

          <div className="relative grid gap-8 p-8 sm:p-12 lg:grid-cols-[auto_1fr] lg:items-center">
            <div className="mx-auto h-32 w-32 overflow-hidden rounded-3xl border-4 border-white/25 bg-white/10 shadow-2xl lg:mx-0">
              {safeImage(item.logo) ? (
                <div className="relative h-full w-full">
                  <Image
                    src={safeImage(item.logo)!}
                    alt={item.name}
                    fill
                    sizes="128px"
                    className="object-cover"
                    unoptimized
                  />
                </div>
              ) : (
                <div className="flex h-full w-full items-center justify-center text-4xl font-extrabold text-white">
                  {item.name.charAt(0)}
                </div>
              )}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/80 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {item.badge || "Seminar Completed"}
                </span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  School Network Partner
                </span>
              </div>
              <h1 className="mt-5 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                {item.name}
              </h1>
              <div className="mt-6 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/90">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-secondary-light" />
                  {item.district}
                  {item.upazila ? `, ${item.upazila}` : ""}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary-light" />
                  Seminar: {formatDate(item.seminarDate)}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Users className="h-4 w-4 text-secondary-light" />
                  {item.participants} participants
                </span>
              </div>
            </div>
          </div>
        </header>
      </Reveal>

      {photoList.length > 0 && (
        <Reveal variant="zoom" scale={0.97} delay={160}>
          <div className="mt-8">
            <ImageSwiper images={photoList} alt={item.name} />
          </div>
        </Reveal>
      )}

      <div className="mt-10 grid grid-cols-1 gap-6 lg:grid-cols-2">
        <Reveal delay={200} className="h-full">
          <div className="flex h-full flex-col overflow-hidden rounded-3xl border-2 border-primary/30 bg-white p-6 shadow-sm sm:p-8">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-lighter text-primary">
                <Users className="h-5 w-5" />
              </span>
              Seminar Overview
            </h2>
            <ul className="mt-5 space-y-3 text-sm text-ink-soft">
              <li className="flex items-center justify-between gap-4 border-b border-ink/5 pb-3">
                <span className="font-medium text-ink">Seminar Date</span>
                <span>
                  {day} {month} {year}
                </span>
              </li>
              <li className="flex items-center justify-between gap-4 border-b border-ink/5 pb-3">
                <span className="font-medium text-ink">Participants</span>
                <span className="font-semibold text-primary">
                  {item.participants}
                </span>
              </li>
              <li className="flex items-start justify-between gap-4 border-b border-ink/5 pb-3">
                <span className="font-medium text-ink">Classes Involved</span>
                <span className="text-right">
                  {(item.grades ?? []).join(", ")}
                </span>
              </li>
              <li className="flex items-center justify-between gap-4">
                <span className="font-medium text-ink">Badge</span>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-lighter px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary">
                  <Award className="h-3.5 w-3.5" />
                  {item.badge || "Seminar Completed"}
                </span>
              </li>
            </ul>
          </div>
        </Reveal>

        {item.ictTeacherName && (
          <Reveal delay={280} className="h-full">
            <div className="flex h-full flex-col overflow-hidden rounded-3xl border-2 border-primary/30 bg-white p-6 shadow-sm sm:p-8">
              <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
                <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-lighter text-primary">
                  <User className="h-5 w-5" />
                </span>
                ICT Teacher
              </h2>
              <div className="mt-5 flex items-center gap-4">
                <Avatar src={item.ictTeacherImage} alt={item.ictTeacherName} />
                <div>
                  <p className="font-bold text-ink">{item.ictTeacherName}</p>
                  {item.ictTeacherRole && (
                    <p className="text-sm text-ink-soft">
                      {item.ictTeacherRole}
                    </p>
                  )}
                  <span className="mt-1.5 inline-flex items-center gap-1 rounded-full bg-mist px-2.5 py-0.5 text-[11px] font-semibold text-ink-soft">
                    <ShieldCheck className="h-3 w-3 text-primary" />
                    Point of Contact
                  </span>
                </div>
              </div>
            </div>
          </Reveal>
        )}
      </div>

      {item.advisorName && String(item.advisorApproved) === "true" && (
        <Reveal delay={160}>
          <div className="mt-6 overflow-hidden rounded-3xl border-2 border-primary/40 bg-linear-to-br from-[#1a3a68] via-primary to-primary-dark p-8 text-white shadow-xl shadow-primary/10 sm:p-10">
            <div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center">
              <span className="grid h-16 w-16 shrink-0 place-items-center rounded-3xl bg-white/15 backdrop-blur-sm">
                <ShieldCheck className="h-8 w-8" />
              </span>
              <div className="flex-1">
                <p className="text-xs font-bold uppercase tracking-widest text-white/70">
                  School ICT Advisor
                </p>
                <h3 className="mt-2 text-2xl font-extrabold">
                  {item.advisorName}
                </h3>
                <p className="mt-1 text-sm text-white/80">
                  {item.advisorDesignation || "ICT Teacher"} ·{" "}
                  {item.name}
                </p>
                {item.advisorJoinedDate && (
                  <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-white/70">
                    <Calendar className="h-3.5 w-3.5" />
                    Advisor since {formatDate(item.advisorJoinedDate)}
                  </p>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {item.headName && String(item.testimonialApproved) === "true" && (
        <Reveal delay={200}>
          <div className="mt-6 overflow-hidden rounded-3xl border-2 border-primary/30 bg-white p-8 shadow-sm sm:p-10">
            <div className="flex items-center gap-2">
              <Quote className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-bold text-ink">
                Words from {item.headDesignation || "the School Head"}
              </h2>
            </div>
            {item.headTestimonial && (
              <p className="mt-5 border-l-4 border-primary pl-5 text-lg italic leading-relaxed text-ink-soft">
                &ldquo;{item.headTestimonial}&rdquo;
              </p>
            )}
            <div className="mt-6 flex items-center gap-4">
              <Avatar src={item.headImage} alt={item.headName} />
              <div>
                <p className="font-bold text-ink">{item.headName}</p>
                <p className="text-sm text-ink-soft">
                  {item.headDesignation}, {item.name}
                </p>
              </div>
            </div>
          </div>
        </Reveal>
      )}

      {(item.timeline ?? []).length > 0 && (
        <Reveal delay={160}>
          <div className="mt-6 overflow-hidden rounded-3xl border-2 border-primary/30 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="flex items-center gap-2 text-lg font-bold text-ink">
              <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary-lighter text-primary">
                <BadgeCheck className="h-5 w-5" />
              </span>
              Our Journey Together
            </h2>
            <ol className="relative mt-8 space-y-6 border-l-2 border-primary/30 pl-6">
              {(item.timeline ?? []).map((entry, i) => {
                const [monthYear, event] = entry.split("|").map((s) => s.trim());
                return (
                  <li key={i} className="relative">
                    <span className="absolute top-1 -left-[31px] grid h-4 w-4 place-items-center rounded-full bg-primary ring-4 ring-primary/20" />
                    <p className="text-xs font-bold uppercase tracking-wider text-primary">
                      {monthYear}
                    </p>
                    <p className="mt-1 text-ink">{event}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </Reveal>
      )}
    </Container>
  );
}