"use client";

import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { navItems, site } from "@/data/site";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";

export default function Navbar() {
  const { hidden, scrolled } = useHideOnScroll();
  const [open, setOpen] = useState(false);

  return (
    <motion.header
      initial={false}
      animate={{ y: hidden ? "-100%" : "0%" }}
      transition={{ duration: 0.35, ease: "easeInOut" }}
      className={`fixed inset-x-0 top-0 z-50 border-b transition-colors duration-300 ${
        scrolled
          ? "border-ink/5 bg-white/85 shadow-sm backdrop-blur-md"
          : "border-transparent bg-white/60 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex h-[4.5rem] max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <a href="#home" className="flex items-center gap-3">
          <span className="relative h-10 w-10 overflow-hidden rounded-xl ring-2 ring-primary/20">
            <Image
              src={site.logo}
              alt={`${site.name} logo`}
              fill
              sizes="40px"
              className="object-cover"
            />
          </span>
          <span className="leading-tight">
            <span className="block text-lg font-extrabold tracking-tight text-ink">
              {site.name}
            </span>
            <span className="block text-[11px] font-medium uppercase tracking-widest text-primary">
              {site.shortTagline}
            </span>
          </span>
        </a>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-primary-lighter hover:text-primary"
            >
              {item.label}
            </a>
          ))}
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${site.name} on Facebook`}
            className="grid h-10 w-10 place-items-center rounded-full border border-ink/10 text-ink-soft transition-colors hover:border-primary hover:text-primary"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
            </svg>
          </a>
          <a
            href="#contact"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark hover:shadow-primary/40"
          >
            Join Us
          </a>
        </div>

        <button
          onClick={() => setOpen((v) => !v)}
          aria-label="Toggle menu"
          aria-expanded={open}
          className="grid h-11 w-11 place-items-center rounded-xl border border-ink/10 text-ink lg:hidden"
        >
          <div className="flex w-5 flex-col gap-1.5">
            <span
              className={`h-0.5 w-full rounded bg-current transition-transform ${
                open ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`h-0.5 w-full rounded bg-current transition-opacity ${
                open ? "opacity-0" : ""
              }`}
            />
            <span
              className={`h-0.5 w-full rounded bg-current transition-transform ${
                open ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </div>
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25 }}
            className="overflow-hidden border-t border-ink/5 bg-white/95 backdrop-blur-md lg:hidden"
          >
            <div className="space-y-1 px-4 py-4">
              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-primary-lighter hover:text-primary"
                >
                  {item.label}
                </a>
              ))}
              <div className="flex items-center gap-3 pt-3">
                <a
                  href="#contact"
                  onClick={() => setOpen(false)}
                  className="flex-1 rounded-xl bg-primary px-5 py-3 text-center text-sm font-semibold text-white shadow-lg shadow-primary/25"
                >
                  Join Us
                </a>
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="grid h-11 w-11 place-items-center rounded-xl border border-ink/10 text-ink-soft"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
                  </svg>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
