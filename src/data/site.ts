export const site = {
  name: "TechPunno",
  tagline: "Building a Safe Digital Society",
  shortTagline: "Cyber awareness for a safer Bangladesh",
  description:
    "TechPunno is a volunteer-driven non-profit organization working to raise cyber awareness, grow digital literacy and help build a safe, inclusive digital society across Bangladesh.",
  foundedYear: 2023,
  facebook: "https://www.facebook.com/techpunnobd2",
  messenger: "https://m.me/techpunnobd2",
  whatsapp: "https://wa.me/8801XXXXXXXXXX",
  youtube: "https://www.youtube.com/@techpunno",
  email: "techpunno@gmail.com",
  phone: "+880 1XXX-XXXXXX",
  address: "Dhaka, Bangladesh",
  logo: "/logo.png",
};

export type NavItem = { label: string; href: string };

export const navItems: NavItem[] = [
  { label: "Home", href: "/#home" },
  { label: "Videos", href: "/#video" },
  { label: "Events", href: "/#events" },
  { label: "Blogs", href: "/#blogs" },
  { label: "News", href: "/#news" },
  { label: "Advisors", href: "/#advisors" },
  { label: "Core Team", href: "/#team" },
  { label: "Volunteer", href: "/volunteers" },
  { label: "Quiz", href: "/quiz" },
  { label: "Contact", href: "/#contact" },
];
