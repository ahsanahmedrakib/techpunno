export type HeroSlide = {
  id: string;
  kicker: string;
  title: string;
  highlight: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  accent: "primary" | "secondary";
  icon: string;
};

export const heroSlides: HeroSlide[] = [
  {
    id: "cyber",
    kicker: "Non-Profit Tech Organization",
    title: "Raising Cyber Awareness",
    highlight: "For a Safer Digital Bangladesh",
    description:
      "TechPunno empowers students, families and communities with the knowledge they need to stay safe online through workshops, campaigns and volunteer programs.",
    ctaLabel: "Explore Events",
    ctaHref: "#events",
    accent: "primary",
    icon: "🛡️",
  },
  {
    id: "learn",
    kicker: "Free Workshops & Bootcamps",
    title: "Learn. Practice.",
    highlight: "Grow Digitally.",
    description:
      "From digital literacy to hands-on cybersecurity sessions, our volunteers make technology accessible to everyone — completely free of cost.",
    ctaLabel: "Watch Videos",
    ctaHref: "#video",
    accent: "secondary",
    icon: "💡",
  },
  {
    id: "volunteer",
    kicker: "Join 500+ Volunteers",
    title: "Be Part of",
    highlight: "TechPunno Family",
    description:
      "Passionate about technology and social good? Become a TechPunno volunteer and help build a digitally safe society across Bangladesh.",
    ctaLabel: "Become a Volunteer",
    ctaHref: "#contact",
    accent: "primary",
    icon: "🤝",
  },
];
