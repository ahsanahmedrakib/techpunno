export type TeamMember = {
  id: string;
  name: string;
  role: string;
  bio: string;
  initials: string;
  image?: string;
};

export const advisors: TeamMember[] = [
  {
    id: "a1",
    name: "Ismail Sarder Niam",
    role: "24 Engineer Construction Brigade",
    bio: "Bangladesh Army · Further development of the Cumilla University Project.",
    initials: "IS",
    image: "/images/advisors/ismail-sarder-niam.jpeg",
  },
  {
    id: "a2",
    name: "Tasbirul Imam",
    role: "QCI / Sr. Manager",
    bio: "Quality Control Inspector (QCI) / Sr. Manager at Peshwarain Restaurant.",
    initials: "TI",
    image: "/images/advisors/tasbirul-imam.jpeg",
  },
  {
    id: "a3",
    name: "Md Ruhul Islam",
    role: "Officer General",
    bio: "Officer General (Recommended) at Bangladesh Krishi Bank.",
    initials: "RI",
    image: "/images/advisors/md-ruhul-islam.jpeg",
  },
  {
    id: "a4",
    name: "Ahsan Ahmed Rakib",
    role: "Software Engineer",
    bio: "Software Engineer at US Bangla Group.",
    initials: "AR",
    image: "/images/advisors/ahsan-ahmed-rakib.jpg",
  },
];

export const coreTeam: TeamMember[] = [
  {
    id: "t1",
    name: "Mehedi Hasan",
    role: "Founder & Online Safety Consultant",
    bio: "Leads the vision, partnerships and overall direction of TechPunno.",
    initials: "MH",
    image: "/images/core-team/mehedi-hasan.jpeg",
  },
];

