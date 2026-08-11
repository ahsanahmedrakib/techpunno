export type EventItem = {
  id: string;
  title: string;
  description: string;
  summary: string;
  date: string;
  month: string;
  year: string;
  location: string;
  mode: "Offline" | "Online";
  category: string;
  status: "upcoming" | "done";
  slug?: string;
  image?: string;
};

export const events: EventItem[] = [
  {
    id: "e1",
    title: "Cyber Security Awareness Workshop",
    description:
      "Hands-on workshop on phishing, password hygiene and safe browsing for students and young professionals.",
    summary:
      "Hands-on phishing, password hygiene and safe browsing workshop.",
    date: "20",
    month: "Aug",
    year: "2026",
    location: "Dhaka",
    mode: "Offline",
    category: "Workshop",
    status: "upcoming",
    slug: "cyber-security-awareness-workshop",
  },
  {
    id: "e2",
    title: "Safe Digital Society Webinar",
    description:
      "An open webinar with experts discussing privacy, misinformation and building a safer online community.",
    summary: "Expert webinar on privacy and misinformation.",
    date: "28",
    month: "Jul",
    year: "2026",
    location: "Online",
    mode: "Online",
    category: "Webinar",
    status: "done",
    slug: "safe-digital-society-webinar",
  },
  {
    id: "e3",
    title: "Volunteer Onboarding 2026",
    description:
      "A warm welcome and onboarding session for our newest TechPunno volunteers and their first assignments.",
    summary: "Welcome and onboarding for new volunteers.",
    date: "15",
    month: "Jul",
    year: "2026",
    location: "Dhaka",
    mode: "Offline",
    category: "Community",
    status: "done",
    slug: "volunteer-onboarding-2026",
  },
  {
    id: "e4",
    title: "Digital Literacy Bootcamp",
    description:
      "Weekend bootcamp covering internet basics, online banking safety and using tech responsibly.",
    summary: "Weekend bootcamp on internet basics and online safety.",
    date: "10",
    month: "Jul",
    year: "2026",
    location: "Dhaka",
    mode: "Offline",
    category: "Bootcamp",
    status: "done",
    slug: "digital-literacy-bootcamp",
  },
  {
    id: "e5",
    title: "National Cyber Safety Campaign",
    description:
      "A nationwide awareness drive on social media and in schools to promote safe internet habits.",
    summary: "Nationwide awareness drive for safe internet habits.",
    date: "05",
    month: "Sep",
    year: "2026",
    location: "Nationwide",
    mode: "Offline",
    category: "Campaign",
    status: "upcoming",
    slug: "national-cyber-safety-campaign",
  },
  {
    id: "e6",
    title: "TechPunno Annual Meetup",
    description:
      "Celebrating a year of impact with volunteers, advisors and community partners across the country.",
    summary: "Celebrating a year of impact with our community.",
    date: "22",
    month: "Nov",
    year: "2026",
    location: "Dhaka",
    mode: "Offline",
    category: "Meetup",
    status: "upcoming",
    slug: "techpunno-annual-meetup",
  },
];
