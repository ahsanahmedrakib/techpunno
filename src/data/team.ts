export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
};

export const advisors: TeamMember[] = [
  {
    id: "a1",
    name: "Advisor One",
    role: "Cybersecurity Expert",
    bio: "Guidance on security best practices and industry insight for our campaigns.",
    initials: "AO",
  },
  {
    id: "a2",
    name: "Advisor Two",
    role: "Academic Mentor",
    bio: "Supports our digital literacy curriculum and university partnerships.",
    initials: "AT",
  },
  {
    id: "a3",
    name: "Advisor Three",
    role: "Social Impact Leader",
    bio: "Advises on community outreach and volunteer development programs.",
    initials: "A3",
  },
  {
    id: "a4",
    name: "Advisor Four",
    role: "Policy & Legal",
    bio: "Helps keep our awareness content accurate, ethical and policy-ready.",
    initials: "A4",
  },
];

export const coreTeam: TeamMember[] = [
  {
    id: "t1",
    name: "Founder & President",
    role: "President",
    bio: "Leads the vision, partnerships and overall direction of TechPunno.",
    initials: "FP",
  },
  {
    id: "t2",
    name: "Vice President",
    role: "Vice President",
    bio: "Coordinates programs and supports the volunteer community.",
    initials: "VP",
  },
  {
    id: "t3",
    name: "General Secretary",
    role: "General Secretary",
    bio: "Handles operations, communication and event coordination.",
    initials: "GS",
  },
  {
    id: "t4",
    name: "Tech Lead",
    role: "Technology Lead",
    bio: "Builds and maintains TechPunno's digital platforms and tools.",
    initials: "TL",
  },
  {
    id: "t5",
    name: "Content Lead",
    role: "Content & Media",
    bio: "Creates awareness content, blogs and campaign material.",
    initials: "CL",
  },
  {
    id: "t6",
    name: "Volunteer Lead",
    role: "Volunteer Management",
    bio: "Onboards, trains and supports our growing volunteer family.",
    initials: "VL",
  },
];
