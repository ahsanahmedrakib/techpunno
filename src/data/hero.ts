export type HeroSlide = {
  id: string;
  kicker: string;
  title: string;
  highlight: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  accent: "primary" | "secondary";
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
  },
  {
    id: "service",
    kicker: "Our Services",
    title: "Awareness Campaigns,",
    highlight: "Workshops & More",
    description:
      "From school workshops and community campaigns to digital literacy training and our Cyber Quiz certification program — we make online safety practical and accessible for everyone.",
    ctaLabel: "Take the Cyber Quiz",
    ctaHref: "/quiz",
    accent: "secondary",
  },
];
