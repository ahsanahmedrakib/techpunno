export type BlogPost = {
  id: string;
  title: string;
  excerpt: string;
  category: string;
  author: string;
  readTime: string;
  date: string;
  slug?: string;
  image?: string;
};

export const blogPosts: BlogPost[] = [
  {
    id: "b1",
    title: "10 Password Rules Everyone Should Follow",
    excerpt:
      "Weak passwords are the #1 reason accounts get hacked. Here are ten simple, practical rules to lock yours down today.",
    category: "Cybersecurity",
    author: "TechPunno Team",
    readTime: "5 min read",
    date: "Jul 18, 2026",
    slug: "10-password-rules",
  },
  {
    id: "b2",
    title: "Spotting a Phishing Message in 60 Seconds",
    excerpt:
      "From fake bank texts to urgent emails — learn the quick checks that reveal most phishing attempts instantly.",
    category: "Awareness",
    author: "TechPunno Team",
    readTime: "4 min read",
    date: "Jul 10, 2026",
    slug: "spotting-phishing-message",
  },
  {
    id: "b3",
    title: "Social Media Privacy: A Beginner's Guide",
    excerpt:
      "Your posts reveal more than you think. A practical walkthrough to tighten privacy on the platforms you use daily.",
    category: "Digital Literacy",
    author: "TechPunno Team",
    readTime: "6 min read",
    date: "Jun 28, 2026",
    slug: "social-media-privacy-guide",
  },
  {
    id: "b4",
    title: "What Parents Should Know About Online Safety",
    excerpt:
      "A friendly guide for parents on screen time, stranger danger and tools to keep kids safe in a connected world.",
    category: "Family Safety",
    author: "TechPunno Team",
    readTime: "7 min read",
    date: "Jun 15, 2026",
    slug: "parents-online-safety",
  },
  {
    id: "b5",
    title: "Two-Factor Authentication, Demystified",
    excerpt:
      "Why a second step changes everything — and how to enable 2FA on the apps you use most in under five minutes.",
    category: "Cybersecurity",
    author: "TechPunno Team",
    readTime: "4 min read",
    date: "Jun 02, 2026",
    slug: "two-factor-authentication",
  },
  {
    id: "b6",
    title: "The TechPunno Volunteer Journey",
    excerpt:
      "From first onboarding to leading a campaign — what it feels like to volunteer with TechPunno across Bangladesh.",
    category: "Community",
    author: "TechPunno Team",
    readTime: "8 min read",
    date: "May 21, 2026",
    slug: "techpunno-volunteer-journey",
  },
];
