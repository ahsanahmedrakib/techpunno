import { blogPosts } from "@/data/blogs";
import { events } from "@/data/events";
import { heroSlides } from "@/data/hero";
import { newsItems } from "@/data/news";
import { advisors, coreTeam } from "@/data/team";
import { quizSets } from "@/data/quiz";
import { videos } from "@/data/videos";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "select"
  | "image"
  | "list"
  | "readonly"
  | "questions";

export interface FieldDef {
  name: string;
  label: string;
  type: FieldType;
  options?: string[];
  required?: boolean;
  placeholder?: string;
  list?: boolean;
  min?: number;
}

export interface CollectionConfig {
  key: string;
  label: string;
  singular: string;
  fields: FieldDef[];
  seed: Record<string, unknown>[];
  listColumns: string[];
  single?: boolean;
  readOnly?: boolean;
}

export type CollectionKey =
  | "advisors"
  | "coreteam"
  | "blogs"
  | "events"
  | "hero"
  | "news"
  | "videos"
  | "quizsets"
  | "contacts"
  | "certificates";

export const collections: Record<CollectionKey, CollectionConfig> = {
  advisors: {
    key: "advisors",
    label: "Advisors",
    singular: "Advisor",
    listColumns: ["name", "role", "slug", "createdAt", "updatedAt"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, list: true, placeholder: "e.g. Jane Doe" },
      { name: "role", label: "Role", type: "text", required: true, list: true, placeholder: "e.g. Technical Advisor" },
      { name: "bio", label: "Bio", type: "textarea", required: true, placeholder: "Brief biography of the advisor" },
      { name: "initials", label: "Initials", type: "text", required: true, placeholder: "e.g. JD" },
      { name: "image", label: "Image path", type: "image", placeholder: "/images/..." },
      { name: "slug", label: "Slug", type: "readonly", list: true },
    ],
    seed: advisors,
  },
  coreteam: {
    key: "coreteam",
    label: "Core Team",
    singular: "Member",
    listColumns: ["name", "role", "slug", "createdAt", "updatedAt"],
    fields: [
      { name: "name", label: "Name", type: "text", required: true, list: true, placeholder: "e.g. Jane Doe" },
      { name: "role", label: "Role", type: "text", required: true, list: true, placeholder: "e.g. Lead Engineer" },
      { name: "bio", label: "Bio", type: "textarea", required: true, placeholder: "Brief bio of the team member" },
      { name: "initials", label: "Initials", type: "text", required: true, placeholder: "e.g. JD" },
      { name: "image", label: "Image path", type: "image", placeholder: "/images/..." },
      { name: "slug", label: "Slug", type: "readonly", list: true },
    ],
    seed: coreTeam,
  },
  blogs: {
    key: "blogs",
    label: "Blogs",
    singular: "Blog",
    listColumns: ["title", "author", "slug", "createdAt", "updatedAt"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, list: true, placeholder: "Enter the blog title" },
      { name: "excerpt", label: "Excerpt", type: "richtext", required: true, placeholder: "Short summary of the blog post" },
      { name: "category", label: "Category", type: "text", required: true, placeholder: "e.g. Technology, Lifestyle" },
      { name: "author", label: "Author", type: "text", required: true, placeholder: "e.g. John Smith" },
      { name: "readTime", label: "Read time", type: "text", required: true, placeholder: "e.g. 5 min read" },
      { name: "date", label: "Date", type: "text", required: true, placeholder: "e.g. Jul 15, 2026" },
      { name: "image", label: "Image path", type: "image", placeholder: "/images/..." },
      { name: "slug", label: "Slug", type: "readonly", list: true },
    ],
    seed: blogPosts,
  },
  events: {
    key: "events",
    label: "Events",
    singular: "Event",
    listColumns: ["title", "status", "slug", "createdAt", "updatedAt"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, list: true, placeholder: "Enter the event title" },
      { name: "description", label: "Description", type: "richtext", required: true, placeholder: "Describe the event details" },
      { name: "date", label: "Day", type: "text", required: true, placeholder: "e.g. 15" },
      { name: "month", label: "Month", type: "text", required: true, placeholder: "e.g. January" },
      { name: "year", label: "Year", type: "text", required: true, placeholder: "e.g. 2026" },
      { name: "location", label: "Location", type: "text", required: true, placeholder: "e.g. Dhaka, Bangladesh" },
      { name: "mode", label: "Mode", type: "select", options: ["Offline", "Online"], required: true, placeholder: "Select mode" },
      { name: "category", label: "Category", type: "text", required: true, placeholder: "e.g. Workshop, Meetup" },
      { name: "status", label: "Status", type: "select", options: ["upcoming", "done"], required: true, placeholder: "Select status" },
      { name: "slug", label: "Slug", type: "readonly", list: true },
    ],
    seed: events,
  },
  hero: {
    key: "hero",
    label: "Hero Slides",
    singular: "Slide",
    listColumns: ["title", "accent", "slug", "createdAt", "updatedAt"],
    fields: [
      { name: "kicker", label: "Kicker", type: "text", required: true, placeholder: "e.g. Welcome to TechPunno" },
      { name: "title", label: "Title", type: "text", required: true, list: true, placeholder: "Main headline text" },
      { name: "highlight", label: "Highlight", type: "text", required: true, placeholder: "Emphasized text in the title" },
      { name: "description", label: "Description", type: "textarea", required: true, placeholder: "Supporting description for the slide" },
      { name: "ctaLabel", label: "CTA label", type: "text", required: true, placeholder: "e.g. Learn More" },
      { name: "ctaHref", label: "CTA link", type: "text", required: true, placeholder: "e.g. /about" },
      { name: "accent", label: "Accent", type: "select", options: ["primary", "secondary"], required: true, placeholder: "Select accent color" },
      { name: "slug", label: "Slug", type: "readonly", list: true },
    ],
    seed: heroSlides,
  },
  news: {
    key: "news",
    label: "News",
    singular: "News",
    listColumns: ["title", "badge", "slug", "createdAt", "updatedAt"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, list: true, placeholder: "Enter the news headline" },
      { name: "summary", label: "Summary", type: "textarea", required: true, placeholder: "Brief summary of the news" },
      { name: "content", label: "Content", type: "richtext", required: true, placeholder: "Full news article content" },
      { name: "date", label: "Date", type: "text", required: true, placeholder: "e.g. Aug 04, 2026" },
      { name: "badge", label: "Badge", type: "select", options: ["Hot", "Update", "Announcement"], required: true, placeholder: "Select badge type" },
      { name: "image", label: "Image path", type: "image", placeholder: "/images/..." },
      { name: "slug", label: "Slug", type: "readonly", list: true },
    ],
    seed: newsItems,
  },
  videos: {
    key: "videos",
    label: "Videos",
    singular: "Video",
    listColumns: ["title", "slug", "createdAt", "updatedAt"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, list: true, placeholder: "Enter the video title" },
      { name: "url", label: "YouTube URL", type: "text", required: true, placeholder: "https://www.youtube.com/watch?v=..." },
      { name: "slug", label: "Slug", type: "readonly", list: true },
    ],
    seed: videos,
  },
  quizsets: {
    key: "quizsets",
    label: "Quiz Sets",
    singular: "Quiz Set",
    listColumns: ["title", "slug", "createdAt", "updatedAt"],
    fields: [
      { name: "title", label: "Title", type: "text", required: true, list: true, placeholder: "Enter the quiz set title" },
      { name: "description", label: "Description", type: "textarea", required: true, placeholder: "Describe what this quiz covers" },
      { name: "durationSeconds", label: "Duration (seconds)", type: "number", required: true, placeholder: "e.g. 300" },
      { name: "questions", label: "Questions", type: "questions", required: true },
      { name: "slug", label: "Slug", type: "readonly", list: true },
    ],
    seed: quizSets,
  },
  contacts: {
    key: "contacts",
    label: "Contact Messages",
    singular: "Message",
    readOnly: true,
    listColumns: ["name", "email", "subject", "createdAt", "updatedAt"],
    fields: [
      { name: "name", label: "Name", type: "text", list: true, placeholder: "e.g. Jane Doe" },
      { name: "email", label: "Email", type: "text", list: true, placeholder: "e.g. jane@example.com" },
      { name: "phone", label: "Phone", type: "text", placeholder: "e.g. +880 1XXXXXXXXX" },
      { name: "subject", label: "Subject", type: "text", list: true, placeholder: "Message subject" },
      { name: "message", label: "Message", type: "textarea", placeholder: "Type the message body" },
      { name: "createdAt", label: "Received", type: "readonly", list: true },
      { name: "updatedAt", label: "Updated", type: "readonly", list: true },
    ],
    seed: [],
  },
  certificates: {
    key: "certificates",
    label: "Certificates",
    singular: "Certificate",
    readOnly: true,
    listColumns: ["certificateId", "name", "percentage", "quizTitle", "createdAt"],
    fields: [
      { name: "certificateId", label: "Certificate ID", type: "text", list: true },
      { name: "name", label: "Name", type: "text", list: true, placeholder: "e.g. Jane Doe" },
      { name: "phone", label: "Phone", type: "text", placeholder: "e.g. 01XXXXXXXXX" },
      { name: "percentage", label: "Percentage", type: "number", list: true, placeholder: "e.g. 90" },
      { name: "score", label: "Score", type: "number", placeholder: "e.g. 9" },
      { name: "total", label: "Total Questions", type: "number", placeholder: "e.g. 10" },
      { name: "quizTitle", label: "Quiz Title", type: "text", list: true, placeholder: "e.g. Cyber Security Basics" },
      { name: "date", label: "Issue Date", type: "text", placeholder: "e.g. 5 August 2026" },
      { name: "createdAt", label: "Issued", type: "readonly", list: true },
      { name: "updatedAt", label: "Updated", type: "readonly", list: true },
    ],
    seed: [],
  },
};

export function isCollectionKey(key: string): key is CollectionKey {
  return key in collections;
}

export const collectionKeys = Object.keys(collections) as CollectionKey[];
