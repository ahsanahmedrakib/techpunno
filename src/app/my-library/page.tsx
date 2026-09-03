import type { Metadata } from "next";
import MyLibraryPage from "@/features/books/components/MyLibrary";
import { site } from "@/features/shared/data/site";

export const metadata: Metadata = {
  title: "My Library",
  description: "Your purchased books on TechPunno. Continue reading where you left off.",
  alternates: { canonical: `${site.url}/my-library` },
};

export default function MyLibrary() {
  return (
    <main className="flex-1 bg-mist pt-24">
      <MyLibraryPage />
    </main>
  );
}
