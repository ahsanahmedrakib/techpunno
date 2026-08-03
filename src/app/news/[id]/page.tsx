import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import NewsSingle from "@/components/sections/NewsSingle";
import { newsItems } from "@/data/news";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return newsItems.map((item) => ({ id: item.id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const item = newsItems.find((n) => n.id === id);
  if (!item) return { title: "News — TechPunno" };
  return {
    title: `${item.title} — TechPunno`,
    description: item.summary,
  };
}

export default async function NewsPage({ params }: Props) {
  const { id } = await params;
  const item = newsItems.find((n) => n.id === id);
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
