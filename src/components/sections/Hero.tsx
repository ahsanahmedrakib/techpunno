"use client";

import { heroSlides } from "@/data/hero";
import { site } from "@/data/site";
import { motion } from "framer-motion";
import "swiper/css";
import "swiper/css/pagination";
import { Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";

const statCards = [
  { value: "500+", label: "Volunteers" },
  { value: "40+", label: "Events Held" },
  { value: "25k+", label: "People Reached" },
];

export default function Hero() {
  return (
    <section id="home" className="relative overflow-hidden pt-18">
      <Swiper
        modules={[Autoplay, Pagination]}
        autoplay={{ delay: 6000, disableOnInteraction: false }}
        pagination={{ clickable: true }}
        loop
        speed={900}
        className="h-full w-full"
      >
        {heroSlides.map((slide) => {
          const isPrimary = slide.accent === "primary";
          return (
            <SwiperSlide key={slide.id}>
              <div
                className={`relative flex min-h-[calc(100svh-4.5rem)] items-center overflow-hidden ${
                  isPrimary
                    ? "bg-linear-to-br from-primary-tint via-cream to-primary-lighter"
                    : "bg-linear-to-br from-secondary-tint via-cream to-secondary-light"
                }`}
              >
                <div className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
                <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

                <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 lg:grid-cols-2 lg:gap-8 lg:px-8">
                  <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, delay: 0.15, ease: "easeOut" }}
                    className="max-w-xl"
                  >
                    <span
                      className={`inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-semibold uppercase tracking-widest ${
                        isPrimary
                          ? "bg-primary-lighter text-primary"
                          : "bg-secondary-light text-secondary"
                      }`}
                    >
                      {slide.kicker}
                    </span>

                    <h1 className="mt-5 text-4xl font-extrabold leading-[1.1] tracking-tight text-ink sm:text-5xl xl:text-6xl">
                      {slide.title}{" "}
                      <span className="text-gradient">{slide.highlight}</span>
                    </h1>

                    <p className="mt-5 max-w-lg text-base leading-relaxed text-ink-soft sm:text-lg">
                      {slide.description}
                    </p>

                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <a
                        href={slide.ctaHref}
                        className="rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-primary/40"
                      >
                        {slide.ctaLabel}
                      </a>
                      <a
                        href={site.facebook}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="rounded-full border-2 border-ink/10 px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
                      >
                        Follow on Facebook
                      </a>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
                    className="relative mx-auto hidden h-85 w-85 sm:h-105 sm:w-105 lg:block"
                  >
                    <div
                      className={`absolute inset-0 rounded-full ${
                        isPrimary
                          ? "bg-linear-to-br from-primary to-primary-dark"
                          : "bg-linear-to-br from-secondary to-secondary-dark"
                      } opacity-95 shadow-2xl`}
                    />
                    <div className="absolute inset-6 rounded-full border-2 border-white/25" />
                    <div className="absolute inset-12 rounded-full border border-white/20" />
                    <div className="absolute inset-0 grid place-items-center text-[120px] drop-shadow-lg">
                      {slide.icon}
                    </div>
                    <div className="absolute -left-4 top-8 animate-bounce rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink shadow-xl [animation-duration:3s]">
                      🛡️ Stay Safe
                    </div>
                    <div className="absolute -right-2 bottom-16 animate-bounce rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-ink shadow-xl [animation-duration:3.5s]">
                      💻 Learn Tech
                    </div>
                  </motion.div>
                </div>
              </div>
            </SwiperSlide>
          );
        })}
      </Swiper>

      <div className="relative border-t border-ink/5 bg-white">
        <div className="mx-auto grid max-w-7xl grid-cols-1 divide-y divide-ink/5 px-4 sm:grid-cols-3 sm:divide-x sm:divide-y-0 sm:px-6 lg:px-8">
          {statCards.map((stat) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex items-center justify-center gap-3 px-4 py-6"
            >
              <span className="text-3xl font-extrabold text-gradient">
                {stat.value}
              </span>
              <span className="text-sm font-medium text-ink-soft">
                {stat.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

