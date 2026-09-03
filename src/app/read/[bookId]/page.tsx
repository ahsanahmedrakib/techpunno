import type { Metadata } from "next";
import ReadPage from "@/features/books/components/ReadPage";
import { site } from "@/features/shared/data/site";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ bookId: string }>;
}): Promise<Metadata> {
  const { bookId } = await params;
  return {
    title: "Read Book",
    description: "Read your book online securely on TechPunno.",
    alternates: { canonical: `${site.url}/read/${bookId}` },
  };
}

export default async function ReadPageRoute({
  params,
}: {
  params: Promise<{ bookId: string }>;
}) {
  const { bookId } = await params;
  return (
    <main className="flex-1 bg-mist pt-24">
      <ReadPage bookId={bookId} />
    </main>
  );
}
