import type { Metadata } from "next";
import Quiz from "@/features/quiz/components/Quiz";
import { site } from "@/features/shared/data/site";

export const metadata: Metadata = {
  title: "Cyber Awareness Quiz",
  description:
    "Test your cyber security knowledge with the TechPunno quiz. Answer within 10 minutes and see your score.",
  openGraph: {
    title: `Cyber Awareness Quiz | ${site.name}`,
    description:
      "Test your cyber security knowledge with the TechPunno quiz. Answer within 10 minutes and see your score.",
    url: `${site.url}/quiz`,
    images: [{ url: site.ogImage, width: 1200, height: 630 }],
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Cyber Awareness Quiz | ${site.name}`,
    images: [site.ogImage],
  },
  alternates: {
    canonical: `${site.url}/quiz`,
  },
};

export default function QuizPage() {
  return (
    <main className="flex-1 bg-mist">
      <Quiz />
    </main>
  );
}
