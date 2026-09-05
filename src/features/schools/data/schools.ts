export type SchoolItem = {
  id: string;
  name: string;
  logo?: string;
  district: string;
  upazila?: string;
  seminarDate: string;
  participants: number;
  grades: string[];
  images: string[];
  ictTeacherName?: string;
  ictTeacherRole?: string;
  ictTeacherImage?: string;
  badge: string;
  advisorName?: string;
  advisorDesignation?: string;
  advisorImage?: string;
  advisorJoinedDate?: string;
  advisorApproved: boolean;
  headName?: string;
  headDesignation?: string;
  headImage?: string;
  headTestimonial?: string;
  headTestimonialPhoto?: string;
  testimonialApproved: boolean;
  timeline: string[];
  status: "published" | "unpublished";
  consentStatus: "pending" | "granted" | "denied";
  slug?: string;
};

export const schools: SchoolItem[] = [
  {
    id: "s1",
    name: "Gopalganj Model High School",
    logo: "/images/dummy.jpeg",
    district: "Gopalganj",
    upazila: "Gopalganj Sadar",
    seminarDate: "2026-08-18",
    participants: 240,
    grades: ["Class 8", "Class 9", "Class 10"],
    images: ["/images/dummy.jpeg"],
    ictTeacherName: "Mahmudul Hasan",
    ictTeacherRole: "ICT Teacher",
    ictTeacherImage: "/images/dummy.jpeg",
    badge: "Seminar Completed",
    advisorName: "Mahmudul Hasan",
    advisorDesignation: "ICT Teacher",
    advisorImage: "/images/dummy.jpeg",
    advisorJoinedDate: "2026-08-22",
    advisorApproved: true,
    headName: "Md. Anowar Hossain",
    headDesignation: "Headmaster",
    headImage: "/images/dummy.jpeg",
    headTestimonial:
      "TechPunno's session was eye-opening for our students. They now understand the importance of online safety and use the internet more responsibly. We are proud to be part of this network.",
    testimonialApproved: true,
    timeline: [
      "August 2026 | Cyber Awareness Seminar",
      "August 2026 | Cyber Quiz Competition",
      "September 2026 | School ICT Advisor Network-এ যুক্ত",
    ],
    status: "published",
    consentStatus: "granted",
    slug: "gopalganj-model-high-school",
  },
];