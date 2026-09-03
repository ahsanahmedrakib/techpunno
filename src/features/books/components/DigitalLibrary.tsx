"use client";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { books, type BookItem } from "@/features/books/data/books";
import { useMergedStaticTable } from "@/lib/api";
import { safeImage } from "@/lib/imageUrl";
import { BookmarkCheck, Download, FileText, Lock, ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import BookPurchaseModal from "./BookPurchaseModal";

export default function DigitalLibrary() {
  const [items] = useMergedStaticTable<BookItem>("books", books);
  const [purchaseBook, setPurchaseBook] = useState<BookItem | null>(null);

  const published = items.filter(
    (b) => !b.status || b.status === "published",
  );

  const downloadFree = (book: BookItem) => {
    const a = document.createElement("a");
    a.href = `/api/book-pdf/${book.id}?dl=1`;
    a.download = `${book.title}.pdf`;
    a.click();
  };

  return (
    <section id="books" className="section-anchor bg-mist py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Digital Library"
          title="Read books on"
          accent="TechPunno"
          description="Free and premium books written to build digital literacy and cyber awareness. Read online anytime, anywhere."
        />

        {published.length === 0 ? (
          <div className="rounded-3xl border-2 border-dashed border-ink/15 bg-white p-16 text-center">
            <FileText className="mx-auto mb-4 h-12 w-12 text-ink-soft/30" />
            <p className="text-sm font-medium text-ink-soft">
              Books are being prepared. Please check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {published.map((book, i) => {
              const isFree = book.isfree === "Free";
              return (
                <Reveal
                  key={book.id}
                  variant={i % 2 === 0 ? "fade-up" : "zoom"}
                  delay={(i % 3) * 120}
                  className="h-full"
                >
                  <div className="group relative flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-ink/10 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15">
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-gradient-admin opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative aspect-3/4 w-full overflow-hidden bg-mist">
                      {safeImage(book.cover) ? (
                        <Image
                          src={safeImage(book.cover)}
                          alt={book.title}
                          fill
                          sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-linear-to-br from-primary via-primary-dark to-[#06402a]">
                          <FileText className="h-16 w-16 text-white/40" />
                        </div>
                      )}
                      {!isFree && (
                        <span className="absolute top-4 left-4 inline-flex items-center gap-1 rounded-full bg-ink/80 px-3 py-1 text-[11px] font-bold text-amber-300 backdrop-blur">
                          <Lock className="h-3 w-3" /> Premium
                        </span>
                      )}
                      {isFree && (
                        <span className="absolute top-4 left-4 rounded-full bg-emerald-500/90 px-3 py-1 text-[11px] font-bold text-white backdrop-blur">
                          Free
                        </span>
                      )}
                      {!isFree && book.price && (
                        <span className="absolute right-4 bottom-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold text-primary shadow backdrop-blur">
                          ৳{book.price}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-bold leading-snug text-ink">
                        {book.title}
                      </h3>
                      <p className="mt-1 text-xs font-medium text-ink-soft">
                        by {book.author}
                      </p>
                      <p className="mt-3 flex-1 text-sm leading-relaxed text-ink-soft">
                        {book.description}
                      </p>
                      <div className="mt-3 flex items-center gap-2 text-xs text-ink-soft">
                        {book.pageCount ? (
                          <span className="inline-flex items-center gap-1 rounded-lg bg-cream px-2.5 py-1">
                            <FileText className="h-3 w-3 text-primary" />
                            {book.pageCount} pages
                          </span>
                        ) : null}
                      </div>
                    </div>

                    <div className="border-t border-ink/10 px-6 py-4">
                      {isFree ? (
                        <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                          <Link
                            href={`/read/${book.id}`}
                            className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
                          >
                            <BookmarkCheck className="h-4 w-4" />
                            Read Online
                          </Link>
                          <button
                            onClick={() => downloadFree(book)}
                            className="inline-flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-primary/40 px-4 py-2.5 text-sm font-semibold text-primary transition-all hover:bg-primary-lighter"
                          >
                            <Download className="h-4 w-4" />
                            Download PDF
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setPurchaseBook(book)}
                          className="inline-flex w-full cursor-pointer items-center justify-center gap-2 rounded-xl bg-gradient-admin px-4 py-2.5 text-sm font-semibold text-white transition-all hover:shadow-lg hover:shadow-primary/20"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Buy &amp; Read
                        </button>
                      )}
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        <div className="mt-12 text-center">
          <Link
            href="/library"
            className="inline-flex items-center gap-2 rounded-2xl bg-white px-8 py-3.5 text-sm font-semibold text-primary ring-2 ring-primary/30 transition-all hover:ring-primary/60"
          >
            View Full Digital Library →
          </Link>
        </div>
      </Container>
      {purchaseBook && (
        <BookPurchaseModal
          open={!!purchaseBook}
          onClose={() => setPurchaseBook(null)}
          book={purchaseBook}
        />
      )}
    </section>
  );
}
