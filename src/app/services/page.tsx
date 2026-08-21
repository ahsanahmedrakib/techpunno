import Services from "@/features/services/components/Services";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Our Services | TechPunno",
  description:
    "Professional digital services from TechPunno — Social Media Recovery, Web Development, OSINT, and Cyber Security Consultation.",
};

export default function ServicesPage() {
  return (
    <main className="flex-1">
      <Services />
    </main>
  );
}
