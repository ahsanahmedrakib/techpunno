import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import VolunteerBadge from "@/features/volunteers/components/VolunteerBadge";
import { getCollection, mapDoc, projectDoc } from "@/lib/db";
import { site } from "@/features/shared/data/site";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

async function findVolunteer(id: string): Promise<Record<string, unknown> | null> {
  const coll = await getCollection("volunteers");
  const doc = await coll.findOne({
    $or: [{ volunteerId: id }, { id }],
    deletedAt: null,
  });
  if (!doc) return null;
  const mapped = mapDoc<Record<string, unknown>>(doc as Record<string, unknown>);
  return projectDoc("volunteers", mapped);
}

async function resolveVolunteerUrl(id: string): Promise<string> {
  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") ??
    headerList.get("host") ??
    "localhost:3000";
  const forwardedProto = headerList.get("x-forwarded-proto");
  const proto =
    forwardedProto?.split(",")[0] ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  return `${proto}://${host}/volunteers/${id}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params;
  const doc = await findVolunteer(id);
  if (!doc) return { title: "Volunteer Not Found — TechPunno" };
  const volName = String(doc.fullName ?? "Volunteer");
  const volType = String(doc.membershipType ?? "Volunteer");
  return {
    title: volName,
    description: `Verified ${volType} profile for ${volName} at TechPunno.`,
    openGraph: {
      title: `${volName} | ${site.name}`,
      description: `Verified ${volType} profile for ${volName} at TechPunno.`,
      url: `${site.url}/volunteers/${id}`,
      images: [{ url: site.ogImage, width: 1200, height: 630 }],
      type: "profile",
    },
    twitter: {
      card: "summary_large_image",
      title: `${volName} | ${site.name}`,
      description: `Verified ${volType} profile for ${volName} at TechPunno.`,
      images: [site.ogImage],
    },
    alternates: {
      canonical: `${site.url}/volunteers/${id}`,
    },
  };
}

export default async function VolunteerPage({ params }: PageProps) {
  const { id } = await params;
  const doc = await findVolunteer(id);

  if (!doc) {
    notFound();
  }

  const volunteerUrl = await resolveVolunteerUrl(id);

  return (
    <main className="flex-1 bg-cream">
      <VolunteerBadge
        volunteer={doc as Record<string, unknown>}
        volunteerUrl={volunteerUrl}
      />
    </main>
  );
}
