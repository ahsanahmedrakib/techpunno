import type { Metadata } from "next";
import VolunteerPage from "@/features/volunteers/components/Volunteer";
import { site } from "@/features/shared/data/site";

export const metadata: Metadata = {
  title: "Volunteers",
  description:
    "Meet the passionate volunteers of TechPunno — a team of dedicated individuals building a safer digital Bangladesh through cyber awareness and digital literacy.",
  openGraph: {
    title: `Volunteers | ${site.name}`,
    description:
      "Meet the passionate volunteers of TechPunno building a safer digital Bangladesh.",
    url: `${site.url}/volunteers`,
    siteName: site.name,
    images: [{ url: site.ogImage, width: 1200, height: 630 }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Volunteers | ${site.name}`,
    description:
      "Meet the passionate volunteers of TechPunno building a safer digital Bangladesh.",
    images: [site.ogImage],
  },
  alternates: {
    canonical: `${site.url}/volunteers`,
  },
};

const page = () => {
  return (
    <div>
      <VolunteerPage />
    </div>
  );
};

export default page;
