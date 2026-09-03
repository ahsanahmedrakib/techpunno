"use client";

import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { BookOpen, FileText, Loader2, Upload } from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "react-toastify";

interface Book {
  id: string;
  title: string;
  author: string;
  isfree: string;
}

export default function BookPdfManager() {
  const { data: books } = useQuery<Book[]>({
    queryKey: ["table", "books"],
    queryFn: () => api.list<Book>("books"),
  });
  const [bookId, setBookId] = useState("");
  const [fileName, setFileName] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const upload = async () => {
    const file = fileRef.current?.files?.[0];
    if (!bookId) {
      toast.error("Select a book first.");
      return;
    }
    if (!file) {
      toast.error("Choose a PDF file to upload.");
      return;
    }
    const fd = new FormData();
    fd.append("bookId", bookId);
    fd.append("file", file);
    setUploading(true);
    try {
      const res = await fetch("/api/book-pdf", {
        method: "POST",
        body: fd,
      });
      const data = (await res.json().catch(() => ({}))) as { error?: string };
      if (!res.ok) throw new Error(data.error || "Upload failed");
      toast.success("PDF uploaded. Paid readers can now access the book.");
      setFileName("");
      if (fileRef.current) fileRef.current.value = "";
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const selectedBook = books?.find((b) => String(b.id) === bookId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="overflow-hidden rounded-lg border-2 border-primary/50 bg-white shadow-sm">
        <div className="flex items-center justify-between bg-linear-to-r from-[#1a3a68] to-primary px-5 py-3.5">
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">
            Book PDF Manager
          </h3>
        </div>
        <div className="space-y-4 p-6">
          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">
              Select Book
            </label>
            <select
              value={bookId}
              onChange={(e) => setBookId(e.target.value)}
              className="w-full cursor-pointer rounded-xl border-2 border-ink/10 bg-cream px-4 py-2.5 text-sm text-ink outline-none transition-all focus:border-primary focus:ring-4 focus:ring-primary/10"
            >
              <option value="">— Select a book —</option>
              {(books ?? []).map((b) => (
                <option key={b.id} value={b.id}>
                  {b.title} ({b.isfree})
                </option>
              ))}
            </select>
          </div>

          {selectedBook && (
            <div className="flex items-center gap-3 rounded-xl bg-mist px-4 py-3 text-sm">
              <BookOpen className="h-5 w-5 text-primary" />
              <div>
                <p className="font-semibold text-ink">{selectedBook.title}</p>
                <p className="text-xs text-ink-soft">
                  by {selectedBook.author} · {selectedBook.isfree} book
                </p>
              </div>
            </div>
          )}

          <div>
            <label className="mb-1 block text-xs font-semibold text-ink-soft">
              PDF File
            </label>
            <div className="flex items-center gap-3">
              <input
                ref={fileRef}
                type="file"
                accept="application/pdf"
                onChange={(e) => setFileName(e.target.files?.[0]?.name ?? "")}
                className="block w-full text-sm text-ink-soft file:mr-3 file:cursor-pointer file:rounded-lg file:border-0 file:bg-primary file:px-4 file:py-2.5 file:text-sm file:font-semibold file:text-white hover:file:bg-primary-dark"
              />
            </div>
            {fileName && (
              <p className="mt-2 inline-flex items-center gap-1.5 text-xs text-ink-soft">
                <FileText className="h-3.5 w-3.5 text-primary" />
                {fileName}
              </p>
            )}
          </div>

          <button
            onClick={upload}
            disabled={uploading}
            className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/20 transition-all hover:bg-primary-dark disabled:opacity-60"
          >
            {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
            {uploading ? "Uploading…" : "Upload PDF"}
          </button>

          <p className="rounded-xl bg-amber-50 px-4 py-3 text-xs text-amber-700">
            The PDF is stored securely and is only served to authenticated users
            who have been approved access. There is no public download link for
            paid books.
          </p>
        </div>
      </div>
    </div>
  );
}
