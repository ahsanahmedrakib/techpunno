"use client";

import Link from "next/link";
import SectionHeading from "@/components/common/SectionHeading";
import { newsItems, type NewsItem } from "@/data/news";
import { fadeUp, stagger } from "@/lib/motion";
import { motion } from "framer-motion";

const badgeStyles: Record<NewsItem["badge"], string> = {
  Hot: "bg-secondary text-white",
  Update: "bg-primary-lighter text-primary",
  Announcement: "bg-mist text-ink-soft",
};

export default function News() {
  const [primary, secondary, ...rest] = newsItems;

  return (
    <section id="news" className="section-anchor bg-mist py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="News & Updates"
          title="Latest from"
          accent="TechPunno"
          description="Milestones, announcements and recaps from our journey across Bangladesh."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-2"
        >
          {[primary, secondary].filter(Boolean).map((item) => (
            <motion.article
              key={item!.id}
              variants={fadeUp}
              className="group relative flex h-full flex-col justify-between overflow-hidden rounded-3xl bg-linear-to-br from-ink via-[#0f3a28] to-primary-dark p-8 text-white shadow-2xl shadow-ink/30 sm:p-10"
            >
              {item!.image && (
                <div className="relative -mx-8 -mt-8 mb-6 aspect-video w-[calc(100%+4rem)] shrink-0 overflow-hidden sm:-mx-10 sm:-mt-10 sm:w-[calc(100%+5rem)]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item!.image}
                    alt={item!.title}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
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
                <Link
                  href={`/news/${item!.id}`}
                  className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
                >
                  Read More →
                </Link>
              </div>
            </motion.article>
          ))}
        </motion.div>

        {rest.length > 0 && (
          <motion.div
            variants={stagger}
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, margin: "-60px" }}
            className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4"
          >
            {rest.map((item) => (
              <Link
                key={item.id}
                href={`/news/${item.id}`}
                className="flex flex-col rounded-2xl border border-ink/5 bg-cream p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-lg"
              >
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
              </Link>
            ))}
          </motion.div>
        )}
      </div>
    </section>
  );
}
