"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import {
  SkeletonVideoCard,
  SkeletonVideoItem,
} from "@/components/common/Skeleton";
import {
  videos,
  youtubeEmbed,
  youtubeThumb,
  type Video,
} from "@/features/home/data/videos";
import { useTable } from "@/lib/api";
import Image from "next/image";
import { useState } from "react";

export default function VideoSection() {
  const [videosData, loading] = useTable<Video>("videos", videos);
  const items = [...(videosData.length ? videosData : videos)].reverse();
  const [current, setCurrent] = useState<Video>(items[0]);
  const activeVideo = items.find((v) => v.id === current.id) ?? items[0];

  if (loading) {
    return (
      <section
        id="video"
        className="section-anchor bg-gradient-admin-subtle py-20 lg:py-28"
      >
        <Container>
          <SectionHeading
            eyebrow="YouTube"
            title="Watch &"
            accent="Learn"
            description="Free tutorials, workshop recordings and awareness content — produced by volunteers for everyone."
          />
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
            <div className="lg:col-span-3">
              <SkeletonVideoCard />
            </div>
            <div className="space-y-4 lg:col-span-2">
              <SkeletonVideoItem />
              <SkeletonVideoItem />
              <SkeletonVideoItem />
            </div>
          </div>
        </Container>
      </section>
    );
  }

  return (
    <section
      id="video"
      className="section-anchor bg-gradient-admin-subtle py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="YouTube"
          title="Watch &"
          accent="Learn"
          description="Free tutorials, workshop recordings and awareness content — produced by volunteers for everyone."
        />

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-5">
          <Reveal variant="fade-left" className="lg:col-span-3">
            <div className="overflow-hidden rounded-3xl bg-ink shadow-2xl shadow-ink/20 ring-1 ring-ink/10">
              <div className="aspect-video w-full">
                <iframe
                  className="h-full w-full"
                  src={youtubeEmbed(activeVideo.url)}
                  title={activeVideo.title}
                  loading="lazy"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            </div>
            <div className="mt-5 flex items-center gap-3">
              <svg
                className="h-7 w-7 shrink-0 text-[#FF0000]"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
              </svg>
              <div>
                <h3 className="text-lg font-bold text-ink">
                  {activeVideo.title}
                </h3>
              </div>
            </div>
          </Reveal>

          <div className="flex flex-col gap-4 lg:col-span-2">
            {items.slice(0, 3).map((video, i) => {
              const active = video.id === activeVideo.id;
              return (
                <Reveal key={video.id} variant="fade-right" delay={i * 100}>
                  <Hoverable>
                    <button
                      type="button"
                      onClick={() => setCurrent(video)}
                      className={`group relative w-full rounded-2xl p-px text-left shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-lg hover:shadow-primary/15 ${
                        active
                          ? "bg-linear-to-br from-primary via-secondary to-primary"
                          : "bg-linear-to-br from-primary/40 via-primary/10 to-secondary/40"
                      }`}
                    >
                      <div
                        className={`flex w-full gap-4 rounded-[calc(1rem-1px)] p-2 transition-colors ${
                          active ? "bg-primary-tint" : "bg-white"
                        }`}
                      >
                        <div className="relative h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-ink/10">
                          <Image
                            src={youtubeThumb(video.url)}
                            alt={video.title}
                            fill
                            sizes="128px"
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                          />
                          <span
                            className={`absolute inset-0 grid place-items-center bg-black/30 text-white transition-opacity duration-300 ${
                              active
                                ? "opacity-100"
                                : "opacity-0 group-hover:opacity-100"
                            }`}
                          >
                            <span className="grid h-8 w-8 place-items-center rounded-full bg-white/90 text-primary shadow-md">
                              ▶
                            </span>
                          </span>
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
                      </div>
                    </button>
                  </Hoverable>
                </Reveal>
              );
            })}

            <Reveal variant="fade-right" delay={items.length * 100}>
              <Hoverable>
                <div className="rounded-2xl bg-gradient-admin p-px transition-all duration-300 group-hover:shadow-lg group-hover:shadow-primary/15">
                  <a
                    href="https://www.youtube.com/@techpunno"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-[calc(1rem-1px)] border-2 border-ink/15 bg-white px-6 py-4.5 text-center text-sm font-semibold text-ink-soft transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    <svg
                      className="h-5 w-5 shrink-0 text-[#FF0000]"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.546 12 3.546 12 3.546s-7.505 0-9.377.504A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.504 9.376.504 9.376.504s7.505 0 9.377-.504a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                    Visit our YouTube channel →
                  </a>
                </div>
              </Hoverable>
            </Reveal>
          </div>
        </div>
      </Container>
    </section>
  );
}
