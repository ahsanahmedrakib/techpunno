"use client";

import { navItems, site } from "@/data/site";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { AnimatePresence, motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

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
          ? "border-ink/5 bg-white/40 shadow-sm backdrop-blur-md"
          : "border-transparent bg-white/20 backdrop-blur-sm"
      }`}
    >
      <nav className="mx-auto flex h-18 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <span className="relative h-15 w-15 overflow-hidden rounded-xl">
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
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-primary-lighter hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
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
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-xl px-4 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-primary-lighter hover:text-primary"
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.header>
  );
}

