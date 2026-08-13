import { blogPosts } from "@/data/blogs";
import { defaultCertificateConfig } from "@/data/certificate";
import { events } from "@/data/events";
import { heroSlides } from "@/data/hero";
import { newsItems } from "@/data/news";
import { quizSets } from "@/data/quiz";
import { advisors, coreTeam } from "@/data/team";
import { videos } from "@/data/videos";
import {
  defaultVolunteerConfig,
  volunteerInterestOptions,
} from "@/data/volunteers";

export type FieldType =
  | "text"
  | "textarea"
  | "richtext"
  | "number"
  | "select"
  | "multiselect"
  | "image"
  | "images"
  | "list"
  | "readonly"
  | "date"
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
  showIf?: Record<string, string>;
}

export interface TableConfig {
  key: string;
  label: string;
  singular: string;
  fields: FieldDef[];
  seed: Record<string, unknown>[];
  listColumns: string[];
  single?: boolean;
  readOnly?: boolean;
  deletable?: boolean;
  canCreate?: boolean;
  createFields?: string[];
  editableFields?: string[];
  defaultStatus?: string;
  statusField?: string;
  statusOptions?: string[];
}

export type TableKey =
  | "advisors"
  | "coreteam"
  | "blogs"
  | "events"
  | "hero"
  | "news"
  | "videos"
  | "quizsets"
  | "contacts"
  | "certificates"
  | "certificateconfig"
  | "volunteers"
  | "volunteerconfig";

export const tables: Record<TableKey, TableConfig> = {
  advisors: {
    key: "advisors",
    label: "Advisors",
    singular: "Advisor",
    listColumns: ["name", "role", "slug", "createdAt", "updatedAt"],
    fields: [
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        list: true,
        placeholder: "e.g. Jane Doe",
      },
      {
        name: "role",
        label: "Role",
        type: "text",
        required: true,
        list: true,
        placeholder: "e.g. Technical Advisor",
      },
      {
        name: "bio",
        label: "Bio",
        type: "textarea",
        required: true,
        placeholder: "Brief biography of the advisor",
      },
      {
        name: "initials",
        label: "Initials",
        type: "text",
        required: true,
        placeholder: "e.g. JD",
      },
      {
        name: "image",
        label: "Image path",
        type: "image",
        placeholder: "/images/...",
      },
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
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        list: true,
        placeholder: "e.g. Jane Doe",
      },
      {
        name: "role",
        label: "Role",
        type: "text",
        required: true,
        list: true,
        placeholder: "e.g. Lead Engineer",
      },
      {
        name: "bio",
        label: "Bio",
        type: "textarea",
        required: true,
        placeholder: "Brief bio of the team member",
      },
      {
        name: "initials",
        label: "Initials",
        type: "text",
        required: true,
        placeholder: "e.g. JD",
      },
      {
        name: "image",
        label: "Image path",
        type: "image",
        placeholder: "/images/...",
      },
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
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        list: true,
        placeholder: "Enter the blog title",
      },
      {
        name: "summary",
        label: "Summary",
        type: "textarea",
        required: true,
        placeholder: "Short summary shown on the blog card",
      },
      {
        name: "excerpt",
        label: "Description",
        type: "richtext",
        required: true,
        placeholder: "Full description shown on the single view",
      },
      {
        name: "category",
        label: "Category",
        type: "text",
        required: true,
        placeholder: "e.g. Technology, Lifestyle",
      },
      {
        name: "author",
        label: "Author",
        type: "text",
        required: true,
        placeholder: "e.g. John Smith",
      },
      {
        name: "authorImage",
        label: "Author image (optional)",
        type: "image",
        placeholder: "/images/...",
      },
      {
        name: "readTime",
        label: "Read time",
        type: "text",
        required: true,
        placeholder: "e.g. 5 min read",
      },
      {
        name: "date",
        label: "Date",
        type: "date",
        required: true,
        placeholder: "e.g. 2026-07-15",
      },
      {
        name: "cardImage",
        label: "Card image",
        type: "image",
        required: true,
        placeholder: "/images/...",
      },
      {
        name: "images",
        label: "Images (multiple)",
        type: "images",
        placeholder: "Upload one or more images",
      },
      {
        name: "externalUrl",
        label: "External link (iframe)",
        type: "text",
        placeholder: "https://example.com/article",
      },
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
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        list: true,
        placeholder: "Enter the event title",
      },
      {
        name: "summary",
        label: "Summary",
        type: "textarea",
        required: true,
        placeholder: "Short summary shown on the event card",
      },
      {
        name: "description",
        label: "Description",
        type: "richtext",
        required: true,
        placeholder: "Describe the event details",
      },
      {
        name: "cardImage",
        label: "Card image",
        type: "image",
        required: true,
        placeholder: "/images/...",
      },
      {
        name: "images",
        label: "Images (multiple)",
        type: "images",
        placeholder: "Upload one or more images",
      },
      {
        name: "date",
        label: "Date",
        type: "date",
        required: true,
        placeholder: "e.g. 2026-08-20",
      },
      {
        name: "location",
        label: "Location",
        type: "text",
        required: true,
        placeholder: "e.g. Dhaka, Bangladesh",
      },
      {
        name: "mode",
        label: "Mode",
        type: "select",
        options: ["Offline", "Online"],
        required: true,
        placeholder: "Select mode",
      },
      {
        name: "category",
        label: "Category",
        type: "text",
        required: true,
        placeholder: "e.g. Workshop, Meetup",
      },
      {
        name: "status",
        label: "Status",
        type: "select",
        options: ["upcoming", "done"],
        required: true,
        placeholder: "Select status",
      },
      {
        name: "externalUrl",
        label: "External link (iframe)",
        type: "text",
        placeholder: "https://example.com/register",
      },
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
      {
        name: "kicker",
        label: "Kicker",
        type: "text",
        required: true,
        placeholder: "e.g. Welcome to TechPunno",
      },
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        list: true,
        placeholder: "Main headline text",
      },
      {
        name: "highlight",
        label: "Highlight",
        type: "text",
        required: true,
        placeholder: "Emphasized text in the title",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
        placeholder: "Supporting description for the slide",
      },
      {
        name: "ctaLabel",
        label: "CTA label",
        type: "text",
        required: true,
        placeholder: "e.g. Learn More",
      },
      {
        name: "ctaHref",
        label: "CTA link",
        type: "text",
        required: true,
        placeholder: "e.g. /about",
      },
      {
        name: "accent",
        label: "Accent",
        type: "select",
        options: ["primary", "secondary"],
        required: true,
        placeholder: "Select accent color",
      },
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
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        list: true,
        placeholder: "Enter the news headline",
      },
      {
        name: "summary",
        label: "Summary",
        type: "textarea",
        required: true,
        placeholder: "Brief summary of the news",
      },
      {
        name: "content",
        label: "Content",
        type: "richtext",
        required: true,
        placeholder: "Full news article content",
      },
      {
        name: "date",
        label: "Date",
        type: "date",
        required: true,
        placeholder: "e.g. 2026-08-04",
      },
      {
        name: "badge",
        label: "Badge",
        type: "select",
        options: ["Hot", "Update", "Announcement"],
        required: true,
        placeholder: "Select badge type",
      },
      {
        name: "cardImage",
        label: "Card image",
        type: "image",
        required: true,
        placeholder: "/images/...",
      },
      {
        name: "images",
        label: "Images (multiple)",
        type: "images",
        placeholder: "Upload one or more images",
      },
      {
        name: "externalUrl",
        label: "External link (iframe)",
        type: "text",
        placeholder: "https://example.com/news",
      },
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
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        list: true,
        placeholder: "Enter the video title",
      },
      {
        name: "url",
        label: "YouTube URL",
        type: "text",
        required: true,
        placeholder: "https://www.youtube.com/watch?v=...",
      },
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
      {
        name: "title",
        label: "Title",
        type: "text",
        required: true,
        list: true,
        placeholder: "Enter the quiz set title",
      },
      {
        name: "description",
        label: "Description",
        type: "textarea",
        required: true,
        placeholder: "Describe what this quiz covers",
      },
      {
        name: "durationSeconds",
        label: "Duration (seconds)",
        type: "number",
        required: true,
        placeholder: "e.g. 300",
      },
      {
        name: "questions",
        label: "Questions",
        type: "questions",
        required: true,
      },
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
      {
        name: "name",
        label: "Name",
        type: "text",
        list: true,
        placeholder: "e.g. Jane Doe",
      },
      {
        name: "email",
        label: "Email",
        type: "text",
        list: true,
        placeholder: "e.g. jane@example.com",
      },
      {
        name: "phone",
        label: "Phone",
        type: "text",
        placeholder: "e.g. +880 1XXXXXXXXX",
      },
      {
        name: "subject",
        label: "Subject",
        type: "text",
        list: true,
        placeholder: "Message subject",
      },
      {
        name: "message",
        label: "Message",
        type: "textarea",
        placeholder: "Type the message body",
      },
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
    deletable: true,
    canCreate: true,
    createFields: ["name", "phone", "percentage"],
    editableFields: ["name"],
    listColumns: [
      "certificateId",
      "name",
      "percentage",
      "quizTitle",
      "createdAt",
    ],
    fields: [
      {
        name: "certificateId",
        label: "Certificate ID",
        type: "text",
        list: true,
      },
      {
        name: "name",
        label: "Name",
        type: "text",
        required: true,
        list: true,
        placeholder: "e.g. Jane Doe",
      },
      {
        name: "phone",
        label: "Phone",
        type: "text",
        required: true,
        placeholder: "e.g. 01XXXXXXXXX",
      },
      {
        name: "percentage",
        label: "Percentage",
        type: "number",
        required: true,
        min: 80,
        list: true,
        placeholder: "e.g. 90",
      },
      { name: "score", label: "Score", type: "number", placeholder: "e.g. 9" },
      {
        name: "total",
        label: "Total Questions",
        type: "number",
        placeholder: "e.g. 10",
      },
      {
        name: "quizTitle",
        label: "Quiz Title",
        type: "text",
        list: true,
        placeholder: "e.g. Cyber Security Basics",
      },
      {
        name: "date",
        label: "Issue Date",
        type: "text",
        placeholder: "e.g. 5 August 2026",
      },
      { name: "createdAt", label: "Issued", type: "readonly", list: true },
      { name: "updatedAt", label: "Updated", type: "readonly", list: true },
    ],
    seed: [],
  },
  certificateconfig: {
    key: "certificateconfig",
    label: "Certificate Config",
    singular: "Configuration",
    single: true,
    listColumns: ["eventTitle", "signatoryName", "createdAt", "updatedAt"],
    fields: [
      {
        name: "eventTitle",
        label: "Event title",
        type: "text",
        required: true,
        list: true,
        placeholder: "e.g. Cyber Smart Girls Initiative 2026",
      },
      {
        name: "eventSubtitle",
        label: "Event subtitle",
        type: "text",
        required: true,
        placeholder: "e.g. Cyber Quiz Competition",
      },
      {
        name: "certifyText",
        label: "Certification line",
        type: "text",
        required: true,
        placeholder: "e.g. This is to certify that",
      },
      {
        name: "quizTitle",
        label: "Quiz title",
        type: "text",
        required: true,
        placeholder: "e.g. TechPunno Cyber Awareness Quiz",
      },
      {
        name: "wishText",
        label: "Wish message",
        type: "textarea",
        required: true,
        placeholder:
          "Use {name} as the recipient name, e.g. We wish {name} all the best.",
      },
      {
        name: "signatoryName",
        label: "Signatory name",
        type: "text",
        required: true,
        list: true,
        placeholder: "e.g. Mehedi Hasan",
      },
      {
        name: "signatoryRole",
        label: "Signatory role",
        type: "text",
        required: true,
        placeholder: "e.g. Founder",
      },
      {
        name: "signatoryImage",
        label: "Signature image",
        type: "image",
        placeholder: "/images/certificate/sign-1.png",
      },
      {
        name: "sealTopText",
        label: "Seal top text",
        type: "text",
        required: true,
        placeholder: "e.g. TECH PUNNO",
      },
      {
        name: "sealBottomText",
        label: "Seal bottom text",
        type: "text",
        required: true,
        placeholder: "e.g. CYBER QUIZ 2026",
      },
      {
        name: "qrLabel",
        label: "QR label",
        type: "text",
        required: true,
        placeholder: "e.g. Scan to verify",
      },
    ],
    seed: [defaultCertificateConfig as unknown as Record<string, unknown>],
  },
  volunteers: {
    key: "volunteers",
    label: "Volunteers",
    singular: "Volunteer",
    defaultStatus: "pending",
    statusField: "status",
    statusOptions: ["pending", "approved", "rejected", "resigned"],
    listColumns: [
      "volunteerId",
      "fullName",
      "occupation",
      "educationalInstitute",
      "membershipType",
      "joiningDate",
      "status",
      "createdAt",
      "updatedAt",
    ],
    fields: [
      {
        name: "volunteerId",
        label: "Volunteer ID",
        type: "readonly",
        list: true,
      },
      {
        name: "fullName",
        label: "Full Name (পূর্ণ নাম)",
        type: "text",
        required: true,
        list: true,
        placeholder: "e.g. Rahim Uddin",
      },
      {
        name: "fatherName",
        label: "Father's Name (পিতার নাম)",
        type: "text",
        required: true,
        placeholder: "e.g. Abdul Karim",
      },
      {
        name: "motherName",
        label: "Mother's Name (মাতার নাম)",
        type: "text",
        required: true,
        placeholder: "e.g. Fatema Begum",
      },
      {
        name: "dateOfBirth",
        label: "Date of Birth (জন্ম তারিখ)",
        type: "date",
        required: true,
        placeholder: "e.g. 2005-01-15",
      },
      {
        name: "gender",
        label: "Gender (লিঙ্গ)",
        type: "select",
        options: ["Male", "Female", "Other"],
        required: true,
        placeholder: "Select gender",
      },
      {
        name: "occupation",
        label: "Occupation (পেশা)",
        type: "select",
        options: ["Student", "Job Holder", "Other"],
        required: true,
        list: true,
        placeholder: "Select occupation",
      },
      {
        name: "mobile",
        label: "Mobile Number (মোবাইল নম্বর)",
        type: "text",
        required: true,
        list: true,
        placeholder: "e.g. 017XXXXXXXX",
      },
      {
        name: "email",
        label: "Email (ইমেইল)",
        type: "text",
        placeholder: "you@example.com",
      },
      {
        name: "whatsapp",
        label: "WhatsApp Number (হোয়াটসঅ্যাপ নম্বর)",
        type: "text",
        placeholder: "e.g. 017XXXXXXXX",
      },
      {
        name: "guardianName",
        label: "Guardian's Name (অভিভাবকের নাম)",
        type: "text",
        required: true,
        placeholder: "Guardian / Emergency contact",
      },
      {
        name: "guardianRelation",
        label: "Guardian Relation (সম্পর্ক)",
        type: "text",
        required: true,
        placeholder: "e.g. Father",
      },
      {
        name: "guardianMobile",
        label: "Guardian Mobile (মোবাইল)",
        type: "text",
        required: true,
        placeholder: "e.g. 017XXXXXXXX",
      },
      {
        name: "educationalInstitute",
        label: "Educational Institute (শিক্ষা প্রতিষ্ঠান)",
        type: "text",
        required: true,
        list: true,
        placeholder: "e.g. XYZ School & College / ABC University",
      },
      {
        name: "company",
        label: "Company Name (কোম্পানির নাম)",
        type: "text",
        showIf: { occupation: "Job Holder" },
        placeholder: "e.g. ABC Technologies Ltd.",
      },
      {
        name: "designation",
        label: "Designation / Job Title (পদবি)",
        type: "text",
        showIf: { occupation: "Job Holder" },
        placeholder: "e.g. Software Engineer",
      },
      {
        name: "department",
        label: "Department / Section (বিভাগ/শাখা)",
        type: "text",
        placeholder: "e.g. Science / Class 9",
      },
      {
        name: "educationLevel",
        label: "Highest Education Level (সর্বোচ্চ শিক্ষাগত যোগ্যতা)",
        type: "text",
        required: true,
        placeholder: "e.g. Bachelor of Science in CSE",
      },
      {
        name: "interestAreas",
        label: "Interest Area (আগ্রহের ক্ষেত্র)",
        type: "multiselect",
        options: volunteerInterestOptions,
      },
      {
        name: "membershipType",
        label: "Membership Type (সদস্যপদ ধরন)",
        type: "select",
        options: ["Ambassador", "Volunteer"],
        required: true,
        placeholder: "Select type",
      },
      {
        name: "memberPosition",
        label: "Member Position (পদবি)",
        type: "text",
        placeholder: "e.g. President, General Secretary",
      },
      {
        name: "joiningDate",
        label: "Joining Date (যোগদানের তারিখ)",
        type: "date",
        list: true,
        placeholder: "e.g. 2025-01-15",
      },
      {
        name: "resignedDate",
        label: "Resigned Date (অবস্থান ত্যাগের তারিখ)",
        type: "date",
        list: true,
        placeholder: "e.g. 2026-06-30",
      },
      {
        name: "registrationFee",
        label: "Registration Fee (৳)",
        type: "text",
        placeholder: "e.g. 50",
      },
      {
        name: "paidBy",
        label: "Paid By (পেমেন্ট মাধ্যম)",
        type: "select",
        options: ["Cash", "bKash", "Nagad"],
        placeholder: "Select method",
      },
      {
        name: "transactionId",
        label: "Transaction ID",
        type: "text",
        placeholder: "e.g. 8P7Q2R3A",
      },
      { name: "image", label: "Photo (ছবি)", type: "image" },
      {
        name: "officeNote",
        label: "Office Note (অফিস নোট)",
        type: "textarea",
        placeholder: "Internal notes",
      },
      {
        name: "approvedBy",
        label: "Approved By (অনুমোদনকারী)",
        type: "select",
        options: ["Founder", "Co-Founder", "Team Leader", "Panel Member"],
        placeholder: "Select approver",
      },
      {
        name: "status",
        label: "Status (অবস্থা)",
        type: "select",
        options: ["pending", "approved", "rejected", "resigned"],
        required: true,
        list: true,
        placeholder: "Select status",
      },
      { name: "createdAt", label: "Registered", type: "readonly", list: true },
      { name: "updatedAt", label: "Updated", type: "readonly", list: true },
    ],
    seed: [],
  },
  volunteerconfig: {
    key: "volunteerconfig",
    label: "Volunteer Config",
    singular: "Configuration",
    single: true,
    listColumns: ["bkashNumber", "registrationFee", "createdAt", "updatedAt"],
    fields: [
      {
        name: "bkashNumber",
        label: "bKash Number (পেমেন্ট নম্বর)",
        type: "text",
        required: true,
        list: true,
        placeholder: "e.g. 017XXXXXXXX",
      },
      {
        name: "bkashQr",
        label: "bKash QR Code Image",
        type: "image",
        placeholder: "/images/uploads/...",
      },
      {
        name: "registrationFee",
        label: "Registration Fee (৳)",
        type: "text",
        required: true,
        list: true,
        placeholder: "e.g. 50",
      },
      { name: "createdAt", label: "Created", type: "readonly", list: true },
      { name: "updatedAt", label: "Updated", type: "readonly", list: true },
    ],
    seed: [defaultVolunteerConfig as unknown as Record<string, unknown>],
  },
};

export function isTableKey(key: string): key is TableKey {
  return key in tables;
}

export const tableKeys = Object.keys(tables) as TableKey[];

