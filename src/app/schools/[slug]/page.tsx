import type { Metadata } from "next";
import { notFound } from "next/navigation";
import SchoolProfile from "@/features/schools/components/SchoolProfile";
import { schools, type SchoolItem } from "@/features/schools/data/schools";
import { getDoc, getDocBySlug } from "@/lib/db";
import { site } from "@/features/shared/data/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return schools.filter((item) => item.slug).map((item) => ({ slug: item.slug! }));
}

async function findSchool(slug: string): Promise<SchoolItem | null> {
  try {
    const doc = (await getDocBySlug("schools", slug)) as SchoolItem | null;
    if (doc && String(doc.status) === "published") return doc;
  } catch {
    /* fall through */
  }
  try {
    const doc = (await getDoc("schools", slug)) as SchoolItem | null;
    if (doc && String(doc.status) === "published") return doc;
  } catch {
    /* fall through to seed data */
  }
  const seed = schools.find(
    (s) => s.slug === slug || s.id === slug,
  );
  return seed && String(seed.status) === "published" ? seed : null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await findSchool(slug);
  if (!item) return { title: "School Network — TechPunno" };
  return {
    title: item.name,
    description: `${item.name} — TechPunno School Network partner in ${item.district}. Seminar completed with ${item.participants} participants.`,
    openGraph: {
      title: `${item.name} | ${site.name}`,
      description: `${item.name} — School Network partner in ${item.district}.`,
      url: `${site.url}/schools/${slug}`,
      images: [{ url: item.logo || site.ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    alternates: {
      canonical: `${site.url}/schools/${slug}`,
    },
  };
}

export default async function SchoolPage({ params }: Props) {
  const { slug } = await params;
  const item = await findSchool(slug);
  if (!item) notFound();

  return (
    <main className="flex-1 bg-cream">
      <SchoolProfile item={item} />
    </main>
  );
}