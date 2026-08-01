# TechPunno — Building a Safe Digital Society

A single-page website for **TechPunno**, a volunteer-driven non-profit technology organization in Bangladesh working on cyber awareness and digital literacy.

## Tech Stack

- **Next.js 16** (App Router)
- **React 19**
- **Tailwind CSS v4** — design system with primary/secondary colors extracted from the TechPunno logo (green `#0C9B5D`, red `#F3353B`)
- **Framer Motion** — scroll-reveal and micro-interactions
- **Swiper** — hero carousel
- **react-hook-form + yup** — contact form validation

## Features

- Sticky navbar that hides on scroll down and reveals on scroll up
- Hero section with an autoplaying Swiper carousel
- Sections: Videos (YouTube embed), Events (with All / Upcoming / Completed filters), Blogs, News, Advisor Team, Core Team, Contact, Footer
- Floating Messenger + WhatsApp chat buttons and a smooth scroll-to-top button (bottom right)
- 100% responsive layout with each section on a distinct light background

## Project Structure

```
src/
├── app/
│   ├── layout.tsx        # Root layout & metadata
│   ├── page.tsx          # Assembles the single-page sections
│   └── globals.css       # Tailwind v4 theme tokens & utilities
├── components/
│   ├── Navbar.tsx        # Scroll-hide navbar + mobile menu
│   ├── Footer.tsx
│   ├── FloatingActions.tsx  # Messenger / WhatsApp / scroll-to-top
│   ├── SectionHeading.tsx
│   ├── TeamCard.tsx
│   └── sections/         # Hero, VideoSection, Events, Blogs, News,
│                         # AdvisorTeam, CoreTeam, Contact
├── data/                 # Editable content (nav, hero, videos, events,
│                         # blogs, news, team, site links)
├── hooks/useHideOnScroll.ts
└── lib/                  # yup schema & motion variants
```

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

Other scripts:

```bash
pnpm build   # production build
pnpm start   # run the production build
pnpm lint    # lint check
```

## Customization

All site content lives in `src/data/`:

- `site.ts` — name, tagline, social links (Facebook, Messenger, WhatsApp, YouTube), contact details
- `events.ts`, `blogs.ts`, `news.ts`, `team.ts` — section content
- `videos.ts` — featured YouTube video ID and video thumbnails
- `hero.ts` — carousel slides

Replace the placeholder team names, events and the WhatsApp number in `src/data/site.ts` with real TechPunno data.

## Deployment

Deploy on [Vercel](https://vercel.com) or any platform supporting Next.js — the project is fully static-prerendered.
