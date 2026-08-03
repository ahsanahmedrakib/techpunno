"use client";

import { useState } from "react";
import SectionHeading from "@/components/common/SectionHeading";
import {
  featuredVideo,
  videos,
  youtubeEmbed,
  youtubeThumb,
} from "@/data/videos";
import { fadeUp, stagger } from "@/lib/motion";
import { motion } from "framer-motion";

export default function VideoSection() {
  const [current, setCurrent] = useState(featuredVideo);

  return (
    <section
      id="video"
      className="section-anchor bg-primary-lighter py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="YouTube"
          title="Watch &"
          accent="Learn"
          description="Free tutorials, workshop recordings and awareness content — produced by volunteers for everyone."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 gap-8 lg:grid-cols-5"
        >
          <motion.div variants={fadeUp} className="lg:col-span-3">
            <div className="overflow-hidden rounded-3xl bg-ink shadow-2xl shadow-ink/20 ring-1 ring-ink/10">
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src={youtubeEmbed(current.url)}
                  title={current.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="mt-5 flex items-start gap-3">
              <span className="mt-1 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-secondary text-sm font-bold text-white">
                ▶
              </span>
              <div>
                <h3 className="text-lg font-bold text-ink">{current.title}</h3>
              </div>
            </div>
          </motion.div>

          <motion.div variants={fadeUp} className="space-y-4 lg:col-span-2">
            {videos.map((video) => {
              const active = video.id === current.id;
              return (
                <button
                  key={video.id}
                  type="button"
                  onClick={() => setCurrent(video)}
                  className={`group flex w-full gap-4 rounded-2xl border p-3 text-left shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/10 ${
                    active
                      ? "border-primary/40 bg-primary-tint shadow-lg shadow-primary/10"
                      : "border-ink/5 bg-white hover:border-primary/30"
                  }`}
                >
                  <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-ink/10">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={youtubeThumb(video.url)}
                      alt={video.title}
                      className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    {!active && (
                      <span className="absolute inset-0 grid place-items-center bg-black/30 text-lg text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        ▶
                      </span>
                    )}
                  </div>
                  <div className="min-w-0 py-1">
                    <h4 className="line-clamp-2 text-sm font-semibold text-ink transition-colors group-hover:text-primary">
                      {video.title}
                    </h4>
                    <span className="mt-2 inline-flex items-center gap-1 text-xs font-medium text-ink-soft">
                      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                      TechPunno Channel
                    </span>
                  </div>
                </button>
              );
            })}

            <a
              href="https://www.youtube.com/@techpunno"
              target="_blank"
              rel="noopener noreferrer"
              className="block rounded-2xl border-2 border-dashed border-ink/15 px-6 py-5 text-center text-sm font-semibold text-ink-soft transition-colors hover:border-primary hover:text-primary"
            >
              Visit our YouTube channel →
            </a>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
