export type NewsItem = {
  id: string;
  title: string;
  summary: string;
  date: string;
  badge: "Hot" | "Update" | "Announcement";
};

export const newsItems: NewsItem[] = [
  {
    id: "n1",
    title: "TechPunno welcomes a fresh batch of volunteers",
    summary:
      "New volunteers joined the TechPunno family as part of our mission to boost cyber awareness and build a safe digital society.",
    date: "Jul 15, 2026",
    badge: "Hot",
  },
  {
    id: "n2",
    title: "National Cyber Safety Campaign goes live",
    summary:
      "Our nationwide awareness drive is now active in schools and on social media, reaching thousands of students.",
    date: "Jul 02, 2026",
    badge: "Announcement",
  },
  {
    id: "n3",
    title: "Safe Digital Society Webinar recap is out",
    summary:
      "Missed the webinar? Read the full recap and highlights from our experts on privacy and misinformation.",
    date: "Jun 20, 2026",
    badge: "Update",
  },
  {
    id: "n4",
    title: "Volunteer onboarding registration now open",
    summary:
      "Interested in volunteering? Onboarding for the next cohort is now open — sign up through the contact form.",
    date: "Jun 10, 2026",
    badge: "Announcement",
  },
];
