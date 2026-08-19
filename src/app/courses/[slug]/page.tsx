import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CourseDetail from "@/features/courses/components/CourseDetail";
import { courses, type CourseItem } from "@/features/courses/data/courses";
import { getDoc, getDocBySlug } from "@/lib/db";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return courses.filter((item) => item.slug).map((item) => ({ slug: item.slug! }));
}

async function findCourse(slug: string): Promise<CourseItem | null> {
  try {
    const doc = (await getDocBySlug("courses", slug)) as CourseItem | null;
    if (doc) return doc;
  } catch {
    /* fall through */
  }
  try {
    const doc = (await getDoc("courses", slug)) as CourseItem | null;
    if (doc) return doc;
  } catch {
    /* fall through to seed data */
  }
  return courses.find((c) => c.slug === slug || c.id === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const item = await findCourse(slug);
  if (!item) return { title: "Course — TechPunno" };
  return {
    title: `${item.title} — TechPunno`,
    description: item.summary,
  };
}

export default async function CoursePage({ params }: Props) {
  const { slug } = await params;
  const item = await findCourse(slug);
  if (!item) notFound();

  return (
    <main className="flex-1 bg-cream">
      <CourseDetail item={item} />
    </main>
  );
}