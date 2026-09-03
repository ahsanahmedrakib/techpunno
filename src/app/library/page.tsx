import type { Metadata } from "next";
import DigitalLibrary from "@/features/books/components/DigitalLibrary";
import { site } from "@/features/shared/data/site";

export const metadata: Metadata = {
  title: "Digital Library",
  description:
    "Browse the TechPunno digital library. Read and download free books, or purchase premium books on digital literacy and cyber awareness.",
  alternates: { canonical: `${site.url}/library` },
};

export default function LibraryPage() {
  return (
    <main className="flex-1 pt-24">
      <DigitalLibrary />
    </main>
  );
}
