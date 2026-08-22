import type { Metadata } from "next";
import About from "@/features/about/components/About";
import { site } from "@/features/shared/data/site";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about TechPunno — a volunteer-driven youth platform for cyber awareness, digital literacy, and technology education in Bangladesh.",
  openGraph: {
    title: `About Us | ${site.name}`,
    description:
      "Learn about TechPunno — a volunteer-driven youth platform for cyber awareness, digital literacy, and technology education in Bangladesh.",
    url: `${site.url}/about`,
    images: [{ url: site.ogImage, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `About Us | ${site.name}`,
    images: [site.ogImage],
  },
  alternates: {
    canonical: `${site.url}/about`,
  },
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <About />
    </main>
  );
}
