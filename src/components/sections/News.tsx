"use client";

import Link from "next/link";
import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import Skeleton from "@/components/common/Skeleton";
import { newsItems, type NewsItem } from "@/data/news";
import { firstImage } from "@/lib/imageUrl";
import Image from "next/image";
import { useTable } from "@/lib/api";

const badgeStyles: Record<NewsItem["badge"], string> = {
  Hot: "bg-secondary text-white",
  Update: "bg-primary-lighter text-primary",
  Announcement: "bg-mist text-ink-soft",
};

export default function News() {
  const [items, loading] = useTable<NewsItem>("news", newsItems);
  const [primary, secondary, ...rest] = items;

  if (loading) {
    return (
      <section id="news" className="section-anchor bg-mist py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="News & Updates"
            title="Latest from"
            accent="TechPunno"
            description="Milestones, announcements and recaps from our journey across Bangladesh."
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Skeleton className="h-80 rounded-3xl" />
            <Skeleton className="h-80 rounded-3xl" />
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section id="news" className="section-anchor bg-mist py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="News & Updates"
          title="Latest from"
          accent="TechPunno"
          description="Milestones, announcements and recaps from our journey across Bangladesh."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          {[primary, secondary].filter(Boolean).map((item, i) => (
            <Reveal
              key={item!.id}
              variant="zoom"
              scale={0.95}
              delay={i * 120}
              className="h-full"
            >
              <Link
                href={`/news/${item!.slug || item!.id}`}
                className="block h-full"
              >
                <Hoverable className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl border-2 border-primary/40 bg-linear-to-br from-ink via-[#0f3a28] to-primary-dark p-8 text-white shadow-2xl shadow-ink/30 transition-all hover:border-primary sm:p-10">
                  {firstImage(item!) && (
                    <div className="relative -mx-8 -mt-8 mb-6 aspect-video w-[calc(100%+4rem)] shrink-0 overflow-hidden sm:-mx-10 sm:-mt-10 sm:w-[calc(100%+5rem)]">
                      <Image
                        src={firstImage(item!)}
                        alt={item!.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-[#0f3a28] to-transparent" />
                    </div>
                  )}
                  <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
                  <div>
                    <span className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white">
                      {item!.badge}
                    </span>
                    <h3 className="mt-5 text-2xl font-bold leading-snug sm:text-3xl">
                      {item!.title}
                    </h3>
                    <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                      {item!.summary}
                    </p>
                  </div>
                  <div className="mt-8 flex items-center justify-between">
                    <span className="text-sm font-medium text-white/70">
                      {item!.date}
                    </span>
                    <span className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5">
                      Read More →
                    </span>
                  </div>
                </Hoverable>
              </Link>
            </Reveal>
          ))}
        </div>

        {rest.length > 0 && (
          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {rest.map((item, i) => (
              <Reveal
                key={item.id}
                variant={i % 2 === 0 ? "fade-up" : "zoom"}
                delay={(i % 4) * 100}
                className="h-full"
              >
                <Link
                  href={`/news/${item.slug || item.id}`}
                  className="block h-full"
                >
                  <Hoverable className="flex h-full flex-col rounded-2xl border-2 border-primary/40 bg-cream transition-all hover:-translate-y-0.5 hover:border-primary hover:bg-white hover:shadow-lg">
                    <div className="relative h-36 shrink-0 overflow-hidden rounded-t-2xl">
                      <Image
                        src={firstImage(item) || "/images/dummy.jpeg"}
                        alt={item.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/40 to-transparent" />
                    </div>
                    <div className="flex flex-1 flex-col p-5">
                      <div className="flex items-center gap-2">
                        <span
                          className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-widest ${badgeStyles[item.badge]}`}
                        >
                          {item.badge}
                        </span>
                        <span className="text-xs font-medium text-ink-soft">
                          {item.date}
                        </span>
                      </div>
                      <h3 className="mt-3 text-base font-bold leading-snug text-ink transition-colors hover:text-primary">
                        {item.title}
                      </h3>
                      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">
                        {item.summary}
                      </p>
                      <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                        Learn more →
                      </span>
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
