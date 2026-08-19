export type CourseItem = {
  id: string;
  title: string;
  summary: string;
  description: string;
  category: string;
  duration: string;
  schedule: string;
  fees: string;
  image?: string;
  status: "open" | "upcoming" | "completed";
  slug?: string;
};

export const courses: CourseItem[] = [
  {
    id: "c1",
    title: "Digital Literacy Basics",
    summary:
      "Learn the fundamentals of using computers, the internet, email and online banking safely and responsibly.",
    description:
      "<p>This beginner-friendly course is designed for students who want to build a strong foundation in digital skills. You will learn how to use computers, browse the internet safely, create secure passwords, recognise phishing attempts and use online banking without falling victim to fraud.</p><p>Every session includes hands-on practice and real-life examples from Bangladesh.</p>",
    category: "Digital Skills",
    duration: "4 weeks",
    schedule: "Friday & Saturday, 4:00 PM - 6:00 PM",
    fees: "Free",
    image: "",
    status: "open",
    slug: "digital-literacy-basics",
  },
  {
    id: "c2",
    title: "Cyber Security Awareness",
    summary:
      "Understand common online threats and learn how to protect yourself, your family and your community.",
    description:
      "<p>This course covers the core concepts of cyber security: malware, phishing, social engineering, password hygiene, two-factor authentication and safe social media practices.</p><p>By the end of the course you will be able to identify threats and help others in your community stay safe online.</p>",
    category: "Cyber Security",
    duration: "6 weeks",
    schedule: "Saturday, 10:00 AM - 12:00 PM",
    fees: "Free",
    image: "",
    status: "open",
    slug: "cyber-security-awareness",
  },
  {
    id: "c3",
    title: "Web Design & Development",
    summary:
      "Build beautiful, responsive websites from scratch using HTML, CSS and modern design principles.",
    description:
      "<p>A practical course for students who want to learn web development. You will learn HTML, CSS, responsive design and how to publish your first website online.</p><p>No prior experience is needed — just curiosity and willingness to learn.</p>",
    category: "Coding",
    duration: "8 weeks",
    schedule: "Friday, 10:00 AM - 1:00 PM",
    fees: "Free",
    image: "",
    status: "upcoming",
    slug: "web-design-and-development",
  },
];
