import Container from "@/components/common/Container";
import ImageSwiper from "@/components/common/ImageSwiper";
import Reveal from "@/components/common/Reveal";
import { events, type EventItem } from "@/data/events";
import { firstImage, singleImageList } from "@/lib/imageUrl";
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Monitor,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export default function EventSingle({ item }: { item: EventItem }) {
  const {
    title,
    description,
    summary,
    date,
    month,
    year,
    location,
    mode,
    category,
    status,
  } = item;
  const isUpcoming = status === "upcoming";
  const related = events.filter((e) => e.slug !== item.slug).slice(0, 3);

  return (
    <Container className="py-12 lg:py-20">
      <Reveal variant="fade-left">
        <Link
          href="/#events"
          className="group inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          Back to Events
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
                  {category}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm ${
                    mode === "Offline" ? "bg-secondary/70" : "bg-white/15"
                  }`}
                >
                  <Monitor className="h-3.5 w-3.5" />
                  {mode}
                </span>
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide text-white backdrop-blur-sm ${
                    isUpcoming ? "bg-emerald-500/80" : "bg-white/15"
                  }`}
                >
                  <CheckCircle2 className="h-3.5 w-3.5" />
                  {isUpcoming ? "Register Open" : "Completed"}
                </span>
              </div>

              <h1 className="mt-6 max-w-2xl text-3xl font-extrabold leading-tight text-white sm:text-4xl lg:text-5xl">
                {title}
              </h1>

              <div className="mt-7 flex flex-wrap gap-x-6 gap-y-3 text-sm font-medium text-white/90">
                <span className="inline-flex items-center gap-2">
                  <MapPin className="h-4 w-4 text-secondary-light" />
                  {location}
                </span>
                <span className="inline-flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-secondary-light" />
                  {date} {month} {year}
                </span>
              </div>
            </div>

            <div className="lg:pl-10">
              <div className="grid h-28 w-28 place-items-center rounded-3xl border-2 border-white/25 bg-white/10 text-center backdrop-blur-md sm:h-32 sm:w-32">
                <div>
                  <span className="block text-4xl font-extrabold leading-none text-white sm:text-5xl">
                    {date}
                  </span>
                  <span className="mt-1 block text-xs font-bold tracking-widest text-white/85 uppercase">
                    {month} {year}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </header>
      </Reveal>

      {singleImageList(item).length > 0 && (
        <Reveal variant="zoom" scale={0.97} delay={160}>
          <div className="mt-8">
            <ImageSwiper images={singleImageList(item)} alt={title} />
          </div>
        </Reveal>
      )}

      <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-[1fr_340px]">
        <Reveal delay={240}>
          <div
            className="prose prose-lg max-w-none text-ink-soft prose-headings:text-ink prose-a:text-primary prose-strong:text-ink"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </Reveal>

        <aside className="space-y-6">
          <Reveal delay={300}>
            <div className="rounded-3xl border-2 border-primary/40 bg-primary-lighter/50 p-7">
              <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-primary uppercase">
                <span className="grid h-8 w-8 place-items-center rounded-lg bg-primary text-white">
                  <CheckCircle2 className="h-4 w-4" />
                </span>
                Event Summary
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-ink">{summary}</p>
            </div>
          </Reveal>

          <Reveal delay={360}>
            <div className="rounded-3xl border border-ink/10 bg-white p-7 shadow-sm">
              <h2 className="text-sm font-bold tracking-wider text-ink uppercase">
                Quick Info
              </h2>
              <ul className="mt-5 space-y-4 text-sm">
                <li className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 text-ink-soft">
                    <MapPin className="h-4 w-4 text-primary" />
                    Location
                  </span>
                  <span className="font-semibold text-ink">{location}</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 text-ink-soft">
                    <Calendar className="h-4 w-4 text-primary" />
                    Date
                  </span>
                  <span className="font-semibold text-ink">
                    {date} {month} {year}
                  </span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 text-ink-soft">
                    <Monitor className="h-4 w-4 text-primary" />
                    Mode
                  </span>
                  <span className="font-semibold text-ink">{mode}</span>
                </li>
                <li className="flex items-center justify-between gap-4">
                  <span className="inline-flex items-center gap-2 text-ink-soft">
                    <CheckCircle2 className="h-4 w-4 text-primary" />
                    Status
                  </span>
                  <span
                    className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wide ${
                      isUpcoming
                        ? "bg-primary-lighter text-primary"
                        : "bg-mist text-ink-soft"
                    }`}
                  >
                    {isUpcoming ? "Register Open" : "Completed"}
                  </span>
                </li>
              </ul>
            </div>
          </Reveal>

          <Reveal delay={420}>
            <div className="rounded-3xl bg-linear-to-br from-primary to-primary-dark p-7 text-center shadow-xl shadow-primary/25">
              <p className="text-lg font-bold text-white">
                {isUpcoming ? "Don't miss this event!" : "Missed this one?"}
              </p>
              <p className="mt-1.5 text-sm leading-relaxed text-white/85">
                {isUpcoming
                  ? "Register now and join the TechPunno community."
                  : "Explore our other upcoming workshops and campaigns."}
              </p>
              <Link
                href="/#events"
                className="mt-5 inline-flex items-center gap-2 rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary shadow-lg transition-all hover:-translate-y-0.5 hover:bg-primary-lighter"
              >
                Explore More Events
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </Reveal>
        </aside>
      </div>

      {related.length > 0 && (
        <Reveal delay={400}>
          <div className="mt-16">
            <h2 className="text-2xl font-bold text-ink">Related events</h2>
            <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((e) => (
                <Link
                  key={e.id}
                  href={`/events/${e.slug || e.id}`}
                  className="group block h-full"
                >
                  <div className="flex h-full flex-col overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-primary/40 hover:shadow-xl hover:shadow-primary/10">
                    <div className="relative h-36 shrink-0 overflow-hidden bg-mist">
                      {firstImage(e) ? (
                        <Image
                          src={firstImage(e)}
                          alt={e.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-linear-to-br from-primary to-primary-dark" />
                      )}
                      <span className="absolute top-3 left-3 rounded-full bg-white/90 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary backdrop-blur">
                        {e.category}
                      </span>
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <h3 className="text-sm font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                        {e.title}
                      </h3>
                      <div className="mt-auto flex items-center justify-between border-t border-ink/5 pt-3 text-xs text-ink-soft">
                        <span className="inline-flex items-center gap-1.5">
                          <Calendar className="h-3.5 w-3.5" />
                          {e.date} {e.month} {e.year}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          <MapPin className="h-3.5 w-3.5" />
                          {e.location}
                        </span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </Reveal>
      )}
    </Container>
  );
}

