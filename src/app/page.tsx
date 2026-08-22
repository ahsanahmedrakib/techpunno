import type { Metadata } from "next";
import Blogs from "@/features/blogs/components/Blogs";
import Contact from "@/features/contact/components/Contact";
import Courses from "@/features/courses/components/Courses";
import Events from "@/features/events/components/Events";
import Hero from "@/features/home/components/Hero";
import Testimonials from "@/features/home/components/Testimonials";
import VideoSection from "@/features/home/components/VideoSection";
import News from "@/features/news/components/News";
import AdvisorTeam from "@/features/team/components/AdvisorTeam";
import CoreTeam from "@/features/team/components/CoreTeam";
import { site } from "@/features/shared/data/site";

export const metadata: Metadata = {
  title: `${site.name} — ${site.tagline}`,
  description: site.description,
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    url: site.url,
    siteName: site.name,
    images: [{ url: site.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    images: [site.ogImage],
  },
  alternates: {
    canonical: site.url,
  },
};

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <VideoSection />
      <Courses />
      <Events />
      <Blogs />
      <News />
      <Testimonials />
      <AdvisorTeam />
      <CoreTeam />
      <Contact />
    </main>
  );
}
