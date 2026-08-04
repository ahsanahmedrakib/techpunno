import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import NewsSingle from "@/components/sections/NewsSingle";
import { newsItems, type NewsItem } from "@/data/news";
import { getDocBySlug } from "@/lib/db";

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
    /* fall through to seed data */
  }
  return newsItems.find((n) => n.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await findNews(slug);
  if (!item) return { title: "News — TechPunno" };
  return {
    title: `${item.title} — TechPunno`,
    description: item.summary,
  };
}

export default async function NewsPage({ params }: Props) {
  const { slug } = await params;
  const item = await findNews(slug);
  if (!item) notFound();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-mist">
        <NewsSingle item={item} />
      </main>
      <Footer />
    </>
  );
}
