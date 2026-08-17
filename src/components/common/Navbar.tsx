"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import { navItems, site } from "@/data/site";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

export default function Navbar() {
  const { hidden, scrolled } = useHideOnScroll();
  const [open, setOpen] = useState(false);

  return (
    <header
      className={`animate-nav-in fixed inset-x-0 top-0 z-50 border-b transition-all duration-300 ${
        hidden ? "-translate-y-full" : "translate-y-0"
      } ${
        scrolled
          ? "border-ink/5 bg-white/40 shadow-sm backdrop-blur-md"
          : "border-transparent bg-white/20 backdrop-blur-sm"
      }`}
    >
      <nav>
        <Container className="flex h-18 items-center justify-between gap-2">
          <Link
            href="/"
            className="animate-slide-link flex items-center gap-2"
            style={{ animationDelay: "120ms" }}
          >
            <span className="relative h-13 w-20 sm:h-15 sm:w-15 overflow-hidden">
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
            {navItems.map((item, i) => (
              <Hoverable key={item.href}>
                <Link
                  href={item.href}
                  className="nav-link block rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-primary-lighter hover:text-primary"
                  style={{ animationDelay: `${200 + i * 60}ms` }}
                >
                  {item.label}
                </Link>
              </Hoverable>
            ))}
          </div>

          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={open}
            className="animate-slide-link grid h-11 w-11 place-items-center rounded-xl border border-ink/10 text-ink lg:hidden"
            style={{ animationDelay: "200ms" }}
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
        </Container>
      </nav>

      {open && (
        <div className="animate-menu-in overflow-hidden border-t border-ink/5 bg-white/95 backdrop-blur-md lg:hidden">
          <div className="space-y-1 px-4 py-4">
            {navItems.map((item, i) => (
              <Hoverable key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="animate-slide-link block rounded-xl px-4 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-primary-lighter hover:text-primary"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {item.label}
                </Link>
              </Hoverable>
            ))}
          </div>
        </div>
      )}
    </header>
  );
}

