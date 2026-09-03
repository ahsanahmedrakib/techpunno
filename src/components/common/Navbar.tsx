"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import AuthModal from "@/features/auth/components/AuthModal";
import { navItems, site } from "@/features/shared/data/site";
import { usePublicUser, publicApi } from "@/lib/api";
import { useHideOnScroll } from "@/hooks/useHideOnScroll";
import { scrollToHashSection } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { LogIn, LogOut, User } from "lucide-react";

export default function Navbar() {
  const { hidden, scrolled } = useHideOnScroll();
  const [open, setOpen] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [accountOpen, setAccountOpen] = useState(false);
  const { data: meData } = usePublicUser();
  const user = meData?.user ?? null;

  const handleNavClick = (href: string) => (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (href.startsWith("/#")) {
      e.preventDefault();
      setAccountOpen(false);
      setOpen(false);
      scrollToHashSection(href.slice(1));
    }
  };

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
                  onClick={handleNavClick(item.href)}
                  className="nav-link block rounded-full px-4 py-2 text-sm font-medium text-ink-soft transition-colors hover:bg-primary-lighter hover:text-primary"
                  style={{ animationDelay: `${200 + i * 60}ms` }}
                >
                  {item.label}
                </Link>
              </Hoverable>
            ))}

            <div className="relative ml-2">
              {user ? (
                <>
                  <button
                    onClick={() => setAccountOpen((v) => !v)}
                    className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark"
                  >
                    <User className="h-4 w-4" />
                    {user.name.split(" ")[0]}
                  </button>
                  {accountOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 overflow-hidden rounded-2xl border border-ink/10 bg-white shadow-2xl">
                      <Link
                        href="/my-library"
                        onClick={() => setAccountOpen(false)}
                        className="block px-4 py-3 text-sm text-ink transition-colors hover:bg-mist"
                      >
                        📚 My Library
                      </Link>
                      <button
                        onClick={() => {
                          setAccountOpen(false);
                          publicApi.logout().finally(() => window.location.reload());
                        }}
                        className="flex w-full cursor-pointer items-center gap-2 px-4 py-3 text-sm text-secondary transition-colors hover:bg-secondary-light"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign out
                      </button>
                    </div>
                  )}
                </>
              ) : (
                <button
                  onClick={() => setAuthOpen(true)}
                  className="inline-flex cursor-pointer items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
              )}
            </div>
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
                  onClick={(e) => {
                    setOpen(false);
                    handleNavClick(item.href)(e);
                  }}
                  className="animate-slide-link block rounded-xl px-4 py-3 text-sm font-medium text-ink-soft transition-colors hover:bg-primary-lighter hover:text-primary"
                  style={{ animationDelay: `${i * 50}ms` }}
                >
                  {item.label}
                </Link>
              </Hoverable>
            ))}
            <div className="mt-2 border-t border-ink/10 pt-2">
              {user ? (
                <>
                  <Link
                    href="/my-library"
                    onClick={() => setOpen(false)}
                    className="block rounded-xl px-4 py-3 text-sm font-semibold text-primary transition-colors hover:bg-primary-lighter"
                  >
                    📚 My Library
                  </Link>
                  <button
                    onClick={() => {
                      setOpen(false);
                      publicApi.logout().finally(() => window.location.reload());
                    }}
                    className="flex w-full cursor-pointer items-center gap-2 rounded-xl px-4 py-3 text-sm font-semibold text-secondary transition-colors hover:bg-secondary-light"
                  >
                    <LogOut className="h-4 w-4" />
                    Sign out
                  </button>
                </>
              ) : (
                <button
                  onClick={() => {
                    setOpen(false);
                    setAuthOpen(true);
                  }}
                  className="flex w-full cursor-pointer items-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <AuthModal open={authOpen} onClose={() => setAuthOpen(false)} />
    </header>
  );
}

