import type { Metadata } from "next";
import { notFound } from "next/navigation";
import NewsSingle from "@/features/news/components/NewsSingle";
import { newsItems, type NewsItem } from "@/features/news/data/news";
import { getDoc, getDocBySlug } from "@/lib/db";
import { site } from "@/features/shared/data/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return newsItems.filter((item) => item.slug).map((item) => ({ slug: item.slug! }));
}

async function findNews(slug: string): Promise<NewsItem | null> {
  try {
    const doc = (await getDocBySlug("news", slug)) as NewsItem | null;
    if (doc) return doc;
  } catch {
    /* fall through */
  }
  try {
    const doc = (await getDoc("news", slug)) as NewsItem | null;
    if (doc) return doc;
  } catch {
    /* fall through to seed data */
  }
  return newsItems.find((n) => n.slug === slug || n.id === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await findNews(slug);
  if (!item) return { title: "News — TechPunno" };
  return {
    title: item.title,
    description: item.summary,
    openGraph: {
      title: `${item.title} | ${site.name}`,
      description: item.summary,
      url: `${site.url}/news/${slug}`,
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
      canonical: `${site.url}/news/${slug}`,
    },
  };
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params;
  const item = await findNews(slug);
  if (!item) notFound();

  return (
    <main className="flex-1 bg-mist">
      <NewsSingle item={item} />
    </main>
  );
}
