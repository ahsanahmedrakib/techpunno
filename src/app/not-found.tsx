"use client";

import Reveal from "@/components/common/Reveal";
import { site } from "@/features/shared/data/site";
import Image from "next/image";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="relative flex min-h-svh items-center justify-center overflow-hidden bg-cream px-4 py-20">
      <div className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -right-20 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

      <Reveal
        once
        variant="blur"
        distance={16}
        duration={800}
        className="relative mx-auto max-w-lg text-center"
      >
        <Reveal once delay={80}>
          <span className="relative inline-block h-16 w-16 overflow-hidden rounded-2xl shadow-lg shadow-primary/20 ring-2 ring-primary/20">
            <Image
              src={site.logo}
              alt={`${site.name} logo`}
              fill
              sizes="64px"
              className="object-cover"
            />
          </span>
        </Reveal>

        <Reveal once variant="zoom" delay={160}>
          <p className="mt-8 text-8xl font-extrabold leading-none tracking-tight sm:text-9xl">
            <span className="text-gradient">404</span>
          </p>
        </Reveal>

        <Reveal once delay={240}>
          <h1 className="mt-4 text-2xl font-bold text-ink sm:text-3xl">
            Looks like you wandered off the digital path
          </h1>
        </Reveal>

        <Reveal once delay={320}>
          <p className="mx-auto mt-3 max-w-md text-sm leading-relaxed text-ink-soft sm:text-base">
            The page you&apos;re looking for doesn&apos;t exist or may have
            moved. Let&apos;s get you back to safety.
          </p>
        </Reveal>

        <Reveal once delay={400}>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/#home"
              className="inline-flex w-full items-center justify-center rounded-full bg-primary px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark sm:w-auto"
            >
              Back to Home
            </Link>
            <Link
              href="/#contact"
              className="inline-flex w-full items-center justify-center rounded-full border-2 border-ink/10 px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary sm:w-auto"
            >
              Contact Us
            </Link>
          </div>
        </Reveal>

        <Reveal once delay={480}>
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-8 inline-flex items-center gap-2 text-sm font-medium text-ink-soft transition-colors hover:text-primary"
          >
            Follow {site.name} on Facebook
            <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
            </svg>
          </a>
        </Reveal>
      </Reveal>
    </div>
  );
}

