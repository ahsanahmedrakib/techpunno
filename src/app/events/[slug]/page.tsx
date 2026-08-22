import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EventSingle from "@/features/events/components/EventSingle";
import { events, type EventItem } from "@/features/events/data/events";
import { getDoc, getDocBySlug } from "@/lib/db";
import { site } from "@/features/shared/data/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return events.filter((item) => item.slug).map((item) => ({ slug: item.slug! }));
}

async function findEvent(slug: string): Promise<EventItem | null> {
  try {
    const doc = (await getDocBySlug("events", slug)) as EventItem | null;
    if (doc) return doc;
  } catch {
    /* fall through */
  }
  try {
    const doc = (await getDoc("events", slug)) as EventItem | null;
    if (doc) return doc;
  } catch {
    /* fall through to seed data */
  }
  return events.find((e) => e.slug === slug || e.id === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await findEvent(slug);
  if (!item) return { title: "Event — TechPunno" };
  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: `${item.title} | ${site.name}`,
      description: item.summary,
      url: `${site.url}/events/${slug}`,
      images: [{ url: site.ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${item.title} | ${site.name}`,
      description: item.summary,
      images: [site.ogImage],
    },
    alternates: {
      canonical: `${site.url}/events/${slug}`,
    },
  };
}

export default async function EventPage({ params }: Props) {
  const { slug } = await params;
  const item = await findEvent(slug);
  if (!item) notFound();

  return (
    <main className="flex-1 bg-cream">
      <EventSingle item={item} />
    </main>
  );
}
