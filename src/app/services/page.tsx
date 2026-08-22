import Services from "@/features/services/components/Services";
import type { Metadata } from "next";
import { site } from "@/features/shared/data/site";

export const metadata: Metadata = {
  title: "Our Services",
  description:
    "Professional digital services from TechPunno — Social Media Recovery, Web Development, OSINT, and Cyber Security Consultation.",
  openGraph: {
    title: `Our Services | ${site.name}`,
    description:
      "Professional digital services from TechPunno — Social Media Recovery, Web Development, OSINT, and Cyber Security Consultation.",
    url: `${site.url}/services`,
    images: [{ url: site.ogImage, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Our Services | ${site.name}`,
    images: [site.ogImage],
  },
  alternates: {
    canonical: `${site.url}/services`,
  },
};

export default function ServicesPage() {
  return (
    <main className="flex-1">
      <Services />
    </main>
  );
}
