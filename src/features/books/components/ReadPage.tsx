"use client";

import Container from "@/components/common/Container";
import AuthModal from "@/features/auth/components/AuthModal";
import BookPurchaseModal from "@/features/books/components/BookPurchaseModal";
import BookReader from "@/features/books/components/BookReader";
import { usePublicUser } from "@/lib/api";
import { Lock, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";

interface BookData {
  id: string;
  title: string;
  author: string;
  description?: string;
  pageCount?: number;
  isfree: string;
  price?: string;
  cover?: string;
}

export default function ReadPage({ bookId }: { bookId: string }) {
  const [book, setBook] = useState<BookData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [authOpen, setAuthOpen] = useState(false);
  const [purchaseOpen, setPurchaseOpen] = useState(false);
  const { data: meData } = usePublicUser();
  const user = meData?.user ?? null;

  useEffect(() => {
    let cancelled = false;
    fetch(`/api/books/${bookId}`, { credentials: "include" })
      .then(async (r) => {
        const data = (await r.json()) as BookData;
        if (r.status === 404) {
          setNotFound(true);
          return;
        }
        if (!cancelled) setBook(data);
      })
      .catch(() => setNotFound(true));
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  if (notFound || (book && !book)) {
    if (notFound) {
      return (
        <Container className="py-24 text-center">
          <p className="text-lg font-semibold text-ink-soft">Book not found.</p>
          <Link
            href="/library"
            className="mt-4 inline-block text-sm font-semibold text-primary"
          >
            ← Back to Library
          </Link>
        </Container>
      );
    }
  }

  if (!book) {
    return (
      <Container className="py-24 text-center text-sm text-ink-soft">
        Loading…
      </Container>
    );
  }

  const isFree = book.isfree === "Free";

  return (
    <Container className="py-12">
      <Link
        href="/library"
        className="mb-6 inline-block text-sm font-semibold text-primary"
      >
        ← Back to Library
      </Link>

      <div className="mb-8 text-center">
        <h1 className="text-2xl font-bold text-ink">{book.title}</h1>
        <p className="mt-1 text-sm text-ink-soft">by {book.author}</p>
      </div>

      {isFree ? (
        <BookReader
          bookId={book.id}
          bookTitle={book.title}
          pageCount={Number(book.pageCount) || 0}
          isFree
        />
      ) : !user ? (
        <div className="mx-auto max-w-md rounded-3xl border-2 border-dashed border-ink/15 bg-white p-10 text-center">
          <Lock className="mx-auto mb-4 h-12 w-12 text-ink-soft/30" />
          <h3 className="text-lg font-bold text-ink">Premium Book</h3>
          <p className="mt-2 text-sm text-ink-soft">
            Sign in to check if you have access to this book, or purchase it to
            start reading.
          </p>
          <button
            onClick={() => setAuthOpen(true)}
            className="mt-6 w-full cursor-pointer rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            Sign In
          </button>
          <button
            onClick={() => setPurchaseOpen(true)}
            className="mt-3 inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-admin px-6 py-3 text-sm font-semibold text-white hover:shadow-lg"
          >
            <ShoppingCart className="h-4 w-4" />
            Buy &amp; Read · ৳{book.price || "—"}
          </button>
        </div>
      ) : (
        <BookReader
          bookId={book.id}
          bookTitle={book.title}
          pageCount={Number(book.pageCount) || 0}
          isFree={false}
          user={user}
        />
      )}

      <AuthModal
        open={authOpen}
        onClose={() => {
          setAuthOpen(false);
          window.location.reload();
        }}
        title="Sign in to read this book"
      />
      {purchaseOpen && book && (
        <BookPurchaseModal
          open={purchaseOpen}
          onClose={() => setPurchaseOpen(false)}
          book={book}
        />
      )}
    </Container>
  );
}
