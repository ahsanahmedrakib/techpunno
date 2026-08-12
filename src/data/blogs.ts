export type BlogPost = {
  id: string;
  title: string;
  summary: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  date: string;
  slug?: string;
  cardImage?: string;
  images?: string[];
  externalUrl?: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "10 Password Rules Everyone Should Follow",
    summary:
      "Weak passwords are the #1 reason accounts get hacked. Lock yours down with these ten simple rules.",
    excerpt:
      "Weak passwords are the #1 reason accounts get hacked. Here are ten simple, practical rules to lock yours down today.",
    category: "Cybersecurity",
    author: "TechPunno Team",
    readTime: "5 min read",
    date: "2026-07-18",
    slug: "10-password-rules",
  },
  {
    id: "b2",
    title: "Spotting a Phishing Message in 60 Seconds",
    summary:
      "Learn the quick checks that reveal most phishing attempts instantly.",
    excerpt:
      "From fake bank texts to urgent emails — learn the quick checks that reveal most phishing attempts instantly.",
    category: "Awareness",
    author: "TechPunno Team",
    readTime: "4 min read",
    date: "2026-07-10",
    slug: "spotting-phishing-message",
  },
  {
    id: "b3",
    title: "Social Media Privacy: A Beginner's Guide",
    summary:
      "Your posts reveal more than you think. A practical guide to tighten platform privacy.",
    excerpt:
      "Your posts reveal more than you think. A practical walkthrough to tighten privacy on the platforms you use daily.",
    category: "Digital Literacy",
    author: "TechPunno Team",
    readTime: "6 min read",
    date: "2026-06-28",
    slug: "social-media-privacy-guide",
  },
  {
    id: "b4",
    title: "What Parents Should Know About Online Safety",
    summary:
      "A friendly guide on screen time, stranger danger and keeping kids safe online.",
    excerpt:
      "A friendly guide for parents on screen time, stranger danger and tools to keep kids safe in a connected world.",
    category: "Family Safety",
    author: "TechPunno Team",
    readTime: "7 min read",
    date: "2026-06-15",
    slug: "parents-online-safety",
  },
  {
    id: "b5",
    title: "Two-Factor Authentication, Demystified",
    summary:
      "Why a second step changes everything — and how to enable 2FA in minutes.",
    excerpt:
      "Why a second step changes everything — and how to enable 2FA on the apps you use most in under five minutes.",
    category: "Cybersecurity",
    author: "TechPunno Team",
    readTime: "4 min read",
    date: "2026-06-02",
    slug: "two-factor-authentication",
  },
  {
    id: "b6",
    title: "The TechPunno Volunteer Journey",
    summary:
      "From first onboarding to leading a campaign — what volunteering feels like.",
    excerpt:
      "From first onboarding to leading a campaign — what it feels like to volunteer with TechPunno across Bangladesh.",
    category: "Community",
    author: "TechPunno Team",
    readTime: "8 min read",
    date: "2026-05-21",
    slug: "techpunno-volunteer-journey",
  },
];
