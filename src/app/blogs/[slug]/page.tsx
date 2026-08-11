import type { Metadata } from "next";
import { notFound } from "next/navigation";
import BlogSingle from "@/components/sections/BlogSingle";
import { blogPosts, type BlogPost } from "@/data/blogs";
import { getDocBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return blogPosts.filter((item) => item.slug).map((item) => ({ slug: item.slug! }));
}

async function findPost(slug: string): Promise<BlogPost | null> {
  try {
    const doc = (await getDocBySlug("blogs", slug)) as BlogPost | null;
    if (doc) return doc;
  } catch {
    /* fall through to seed data */
  }
  return blogPosts.find((p) => p.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await findPost(slug);
  if (!item) return { title: "Blog — TechPunno" };
  return {
    title: `${item.title} — TechPunno`,
    description: item.excerpt,
  };
}

export default async function BlogPage({ params }: Props) {
  const { slug } = await params;
  const item = await findPost(slug);
  if (!item) notFound();

  return (
    <main className="flex-1 bg-primary-lighter">
      <BlogSingle item={item} />
    </main>
  );
}
