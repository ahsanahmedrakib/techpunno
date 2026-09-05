import type { Metadata } from "next";
import SchoolNetwork from "@/features/schools/components/SchoolNetwork";
import { site } from "@/features/shared/data/site";

export const metadata: Metadata = {
  title: "School Network",
  description:
    "Explore the schools where TechPunno has successfully hosted Cyber Awareness Seminars and our growing School ICT Advisor Network across Bangladesh.",
  alternates: { canonical: `${site.url}/schools` },
};

export default function SchoolsPage() {
  return (
    <main className="flex-1 pt-24">
      <SchoolNetwork />
    </main>
  );
}