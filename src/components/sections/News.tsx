"use client";

import SectionHeading from "@/components/common/SectionHeading";
import { newsItems, type NewsItem } from "@/data/news";
import { site } from "@/data/site";
import { fadeUp, stagger } from "@/lib/motion";
import { motion } from "framer-motion";

const badgeStyles: Record<NewsItem["badge"], string> = {
  Hot: "bg-secondary text-white",
  Update: "bg-primary-lighter text-primary",
  Announcement: "bg-mist text-ink-soft",
};

export default function News() {
  const [highlight, ...rest] = newsItems;

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
          <motion.article
            variants={fadeUp}
            className="group relative flex flex-col justify-between overflow-hidden rounded-3xl bg-linear-to-br from-ink via-[#0f3a28] to-primary-dark p-8 text-white shadow-2xl shadow-ink/30 sm:p-10"
          >
            <div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-primary/30 blur-3xl" />
            <div>
              <span className="inline-flex rounded-full bg-secondary px-4 py-1.5 text-[11px] font-bold uppercase tracking-widest text-white">
                {highlight.badge}
              </span>
              <h3 className="mt-5 text-2xl font-bold leading-snug sm:text-3xl">
                {highlight.title}
              </h3>
              <p className="mt-4 text-sm leading-relaxed text-white/80 sm:text-base">
                {highlight.summary}
              </p>
            </div>
            <div className="mt-8 flex items-center justify-between">
              <span className="text-sm font-medium text-white/70">
                {highlight.date}
              </span>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-ink transition-transform hover:-translate-y-0.5"
              >
                Read More →
              </a>
            </div>
          </motion.article>

          <div className="flex flex-col gap-4">
            {rest.map((item, index) => (
              <motion.article
                key={item.id}
                variants={fadeUp}
                className="flex flex-1 flex-col rounded-2xl border border-ink/5 bg-cream p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-white hover:shadow-lg"
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
                <h3 className="mt-3 text-lg font-bold leading-snug text-ink transition-colors hover:text-primary">
                  {item.title}
                </h3>
                <p className="mt-1.5 flex-1 text-sm leading-relaxed text-ink-soft">
                  {item.summary}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-primary">
                  {index === 0 ? "View details" : "Learn more"} →
                </span>
              </motion.article>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

