"use client";

import Container from "@/components/common/Container";
import SectionHeading from "@/components/common/SectionHeading";
import AuthModal from "@/features/auth/components/AuthModal";
import { usePublicUser } from "@/lib/api";
import { safeImage } from "@/lib/imageUrl";
import { BookOpen, BookmarkCheck, LogIn, RefreshCw } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

interface LibraryBook {
  bookId: string;
  bookTitle: string;
  cover: string;
  author: string;
  pageCount: number;
  progress: number;
  lastPage: number;
}

export default function MyLibraryPage() {
  const { data: meData, isLoading: authLoading } = usePublicUser();
  const user = meData?.user ?? null;
  const [authOpen, setAuthOpen] = useState(false);
  const [data, setData] = useState<LibraryBook[] | null>(null);
  const [loading, setLoading] = useState(false);

  const loadLibrary = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/my-library", { credentials: "include" });
      const json = (await res.json()) as { library: LibraryBook[] };
      setData(json.library || []);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (!user) {
      setAuthOpen(true);
      return;
    }
    void loadLibrary();
  };

  return (
    <>
      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        title="Sign in to see your library"
      />
      <Container className="py-12">
        <SectionHeading
          eyebrow="My Library"
          title="Your purchased"
          accent="books"
          description="View the books you purchased and continue reading where you left off."
        />

        {authLoading ? (
          <div className="py-20 text-center text-sm text-ink-soft">Loading…</div>
        ) : !user ? (
          <div className="rounded-3xl border-2 border-dashed border-ink/15 bg-white p-16 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-ink-soft/30" />
            <h3 className="text-lg font-bold text-ink">Sign in to view your library</h3>
            <p className="mx-auto mt-2 max-w-md text-sm text-ink-soft">
              Log in to see the books you&apos;ve purchased and continue reading
              online.
            </p>
            <button
              onClick={() => setAuthOpen(true)}
              className="mt-6 inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              <LogIn className="h-4 w-4" />
              Sign In
            </button>
          </div>
        ) : data === null ? (
          <div className="py-16 text-center">
            <button
              onClick={handleContinue}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 animate-spin" />
              ) : (
                <BookmarkCheck className="h-4 w-4" />
              )}
              Load My Library
            </button>
          </div>
        ) : data.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-ink/15 bg-white p-16 text-center">
            <BookOpen className="mx-auto mb-4 h-12 w-12 text-ink-soft/30" />
            <h3 className="text-lg font-bold text-ink">No books yet</h3>
            <p className="mt-2 text-sm text-ink-soft">
              You haven&apos;t purchased any books yet. Browse the digital library
              to get started.
            </p>
            <Link
              href="/library"
              className="mt-6 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
            >
              Browse Library
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((book) => (
              <div
                key={book.bookId}
                className="flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink/10"
              >
                <div className="flex gap-4 p-5">
                  <div className="relative h-28 w-20 shrink-0 overflow-hidden rounded-lg bg-mist">
                    {safeImage(book.cover) ? (
                      <Image
                        src={safeImage(book.cover)}
                        alt={book.bookTitle}
                        fill
                        sizes="80px"
                        className="object-cover"
                      />
                    ) : (
                      <div className="grid h-full w-full place-items-center bg-gradient-admin">
                        <BookOpen className="h-6 w-6 text-white/50" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-1 flex-col">
                    <h3 className="text-sm font-bold text-ink">{book.bookTitle}</h3>
                    <p className="mt-0.5 text-xs text-ink-soft">by {book.author}</p>
                    {book.progress > 0 && (
                      <p className="mt-2 text-xs font-bold text-primary">
                        Reading Progress: {book.progress}%
                      </p>
                    )}
                  </div>
                </div>
                <div className="mt-auto border-t border-ink/10 px-5 py-4">
                  <div className="mb-2 h-2 w-full overflow-hidden rounded-full bg-mist">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${book.progress}%` }}
                    />
                  </div>
                  <Link
                    href={`/read/${book.bookId}`}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
                  >
                    <BookmarkCheck className="h-4 w-4" />
                    {book.progress > 0 ? "Continue Reading" : "Read Now"}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </Container>
    </>
  );
}
