import type { Metadata } from "next";
import About from "@/features/about/components/About";

export const metadata: Metadata = {
  title: "About Us | TechPunno",
  description:
    "Learn about TechPunno — a volunteer-driven youth platform for cyber awareness, digital literacy, and technology education in Bangladesh.",
};

export default function AboutPage() {
  return (
    <main className="flex-1">
      <About />
    </main>
  );
}
