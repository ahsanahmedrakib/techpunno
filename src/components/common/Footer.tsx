"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import { navItems, site } from "@/data/site";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import VolunteerFooter from "../sections/VolunteerFooter";
import {
  MessengerIcon,
  WhatsappIcon,
  YoutubeIcon,
} from "./SocialIcons";

export default function Footer() {
  const path = usePathname();
  return (
    <footer className="bg-ink text-white">
      {path !== "/volunteers" && <VolunteerFooter />}
      <Container className="grid grid-cols-1 gap-10 py-14 sm:grid-cols-2 lg:grid-cols-4">
        <Reveal variant="fade-left" className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="relative h-13 w-13 overflow-hidden rounded-lg ring">
              <Image
                src={site.logo}
                alt={`${site.name} logo`}
                fill
                sizes="44px"
                className="object-cover"
              />
            </span>
            <span className="text-lg font-extrabold">{site.name}</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/70">
            {site.description}
          </p>
          <Hoverable className="mt-5">
            <a
              href={site.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
              >
                <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
              </svg>
              Follow us on Facebook
            </a>
          </Hoverable>
          <Hoverable className="mt-3">
            <a
              href={site.youtube}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
            >
              <YoutubeIcon size={16} />
              Subscribe on YouTube
            </a>
          </Hoverable>
        </Reveal>

        <Reveal variant="fade-up" delay={120}>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/50">
            Quick Links
          </h4>
          <ul className="mt-4 space-y-2.5">
            {navItems.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="text-sm text-white/80 transition-colors hover:text-primary-light"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
        </Reveal>

        <Reveal variant="fade-up" delay={240}>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/50">
            Get Involved
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li>
              <Link
                href="/volunteers"
                className="transition-colors hover:text-primary-light"
              >
                Become a Volunteer
              </Link>
            </li>
            <li>
              <Link
                href="/#events"
                className="transition-colors hover:text-primary-light"
              >
                Attend an Event
              </Link>
            </li>
            <li>
              <a
                href="#video"
                className="transition-colors hover:text-primary-light"
              >
                Watch & Learn
              </a>
            </li>
            <li>
              <a
                href="#blogs"
                className="transition-colors hover:text-primary-light"
              >
                Read Our Blogs
              </a>
            </li>
            <li>
              <a
                href={site.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="transition-colors hover:text-primary-light"
              >
                Partnership
              </a>
            </li>
          </ul>
        </div>
        </Reveal>

        <Reveal variant="fade-up" delay={360}>
        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/50">
            Contact
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li>
              <a
                href={`mailto:${site.email}`}
                className="transition-colors hover:text-primary-light"
              >
                {site.email}
              </a>
            </li>
            <li>
              <a
                href={`tel:${site.phone.replace(/[^+\d]/g, "")}`}
                className="transition-colors hover:text-primary-light"
              >
                {site.phone}
              </a>
            </li>
            <li>{site.address}</li>
          </ul>
        </div>
        </Reveal>
      </Container>

      <div className="border-t border-white/10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
        <Reveal distance={12}>
        <Container className="flex flex-col items-center justify-between gap-3 py-5 text-xs text-white/60 sm:flex-row">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>Built with 💚 for a safe digital society.</p>
        </Container>
        </Reveal>
      </div>

      {/* Developer info  */}
      <div className="relative border-t border-white/10">
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-linear-to-r from-transparent via-primary to-transparent" />
        <Container>
          <Reveal
            variant="blur"
            distance={16}
            duration={800}
            className="relative my-8 overflow-hidden rounded-xl bg-white/4 p-2 ring-1 ring-white/10"
          >
            <div className="pointer-events-none absolute -left-10 -top-10 h-36 w-36 rounded-full bg-primary/20 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-12 -right-10 h-36 w-36 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative flex flex-col items-center justify-between gap-6 sm:flex-row sm:text-left">
              <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-center">
                <div className="w-20 h-20 overflow-hidden rounded-xl">
                  <Image
                    src={"/images/rakib.jpg"}
                    alt={"Rakib"}
                    height={80}
                    width={300}
                    className="object-cover w-full h-full"
                  />
                </div>

                <div className="text-center sm:text-left">
                  <span className="text-[11px] font-bold uppercase tracking-widest text-primary-light">
                    Build & Maintenance by
                  </span>
                  <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">
                    Ahsan Ahmed Rakib
                  </h3>
                  <p className="mt-1 text-sm text-white/60">
                    Full-stack Web Developer · Next.js & Tailwind CSS
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Hoverable>
                  <a
                    href="https://m.me/rakibahsanahmed"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on Messenger with Rakib"
                    className="inline-flex items-center gap-2 rounded-full bg-[#0084FF] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#0084FF]/40"
                  >
                    <MessengerIcon size={16} />
                    Messenger
                  </a>
                </Hoverable>
                <Hoverable>
                  <a
                    href="https://wa.me/8801631112475"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Chat on WhatsApp with Rakib"
                    className="inline-flex items-center gap-2 rounded-full bg-[#25D366] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:-translate-y-0.5 hover:shadow-xl hover:shadow-[#25D366]/40"
                  >
                    <WhatsappIcon size={16} />
                    WhatsApp
                  </a>
                </Hoverable>
              </div>
            </div>

            <div className="relative mt-2 flex flex-col items-center justify-between gap-3 border-t border-white/10 pt-2 text-xs text-white/50 sm:flex-row">
              <p className="inline-flex items-center gap-1.5">
                <span className="text-secondary">❤</span> Built with Next.js &
                Tailwind CSS
              </p>
              <p className="inline-flex items-center gap-1.5">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary-light" />
                Available for freelance & open-source work
              </p>
            </div>
          </Reveal>
        </Container>
      </div>
    </footer>
  );
}
