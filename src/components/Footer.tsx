import Image from "next/image";
import { navItems, site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="bg-ink text-white">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div className="sm:col-span-2 lg:col-span-1">
          <div className="flex items-center gap-3">
            <span className="relative h-11 w-11 overflow-hidden rounded-xl ring-2 ring-white/20">
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
          <a
            href={site.facebook}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-5 inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-white/20"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
              <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
            </svg>
            Follow us on Facebook
          </a>
        </div>

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

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/50">
            Get Involved
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li>
              <a href="#contact" className="transition-colors hover:text-primary-light">
                Become a Volunteer
              </a>
            </li>
            <li>
              <a href="#events" className="transition-colors hover:text-primary-light">
                Attend an Event
              </a>
            </li>
            <li>
              <a href="#video" className="transition-colors hover:text-primary-light">
                Watch & Learn
              </a>
            </li>
            <li>
              <a href="#blogs" className="transition-colors hover:text-primary-light">
                Read Our Blogs
              </a>
            </li>
            <li>
              <a href={site.facebook} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-primary-light">
                Partnership
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-sm font-bold uppercase tracking-widest text-white/50">
            Contact
          </h4>
          <ul className="mt-4 space-y-2.5 text-sm text-white/80">
            <li>
              <a href={`mailto:${site.email}`} className="transition-colors hover:text-primary-light">
                {site.email}
              </a>
            </li>
            <li>
              <a href={`tel:${site.phone.replace(/[^+\d]/g, "")}`} className="transition-colors hover:text-primary-light">
                {site.phone}
              </a>
            </li>
            <li>{site.address}</li>
          </ul>
          <div className="mt-5 rounded-2xl bg-white/5 p-4 text-sm text-white/70">
            <span className="font-semibold text-primary-light">
              Want to volunteer?
            </span>
            <p className="mt-1">
              Fill out the contact form and our volunteer team will reach out.
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-white/60 sm:flex-row sm:px-6 lg:px-8">
          <p>
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </p>
          <p>
            Built with 💚 for a safe digital society.
          </p>
        </div>
      </div>
    </footer>
  );
}
