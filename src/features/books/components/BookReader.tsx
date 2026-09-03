"use client";

import { publicApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  BookMarked,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Maximize,
  Minimize,
  Minus,
  PersonStanding,
  Plus,
} from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";

interface PageProxy {
  getViewport(opts: { scale: number }): { width: number; height: number };
  render(opts: {
    canvasContext: CanvasRenderingContext2D;
    viewport: { width: number; height: number };
  }): { promise: Promise<void> };
}

interface PdfDoc {
  numPages: number;
  getPage(n: number): Promise<PageProxy>;
}

interface PdfJsModule {
  getDocument(opts: { data: ArrayBuffer }): { promise: Promise<PdfDoc> };
  GlobalWorkerOptions: { workerSrc: string };
  default?: PdfJsModule;
}

interface BookReaderProps {
  bookId: string;
  bookTitle: string;
  pageCount: number;
  isFree: boolean;
  user?: { name: string; id?: string; email?: string } | null;
}

let pdfjsWorkerReady = false;

export default function BookReader({
  bookId,
  bookTitle,
  isFree,
  user,
}: BookReaderProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pdfInstance, setPdfInstance] = useState<PdfDoc | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.2);
  const [zoomIn, setZoomIn] = useState(false);
  const [showBookmark, setShowBookmark] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const currentScale = zoomIn ? scale * 1.6 : scale;

  const { data: meData } = useQuery({
    queryKey: ["public-user"],
    queryFn: () => publicApi.me(),
    enabled: !isFree,
  });
  const displayUser = user ?? (isFree ? null : meData?.user ?? null);

  const drawWatermark = useCallback(
    (ctx: CanvasRenderingContext2D, width: number, height: number, name: string) => {
      ctx.save();
      ctx.globalAlpha = 0.12;
      ctx.font = `${Math.max(14, width / 40)}px sans-serif`;
      ctx.fillStyle = "#0b2b1d";
      const userId = displayUser?.id ? displayUser.id.slice(0, 8).toUpperCase() : "";
      const lines = [
        "Tech Punno",
        `Licensed to: ${name}`,
        userId ? `User ID: ${userId}` : "",
      ].filter(Boolean);
      const cx = width / 2;
      const cy = height / 2;
      ctx.translate(cx, cy);
      ctx.rotate(-Math.PI / 6);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      lines.forEach((line, i) => {
        ctx.fillText(line, 0, i * (ctx.measureText(line).width / 14 + 6));
      });
      ctx.restore();
    },
    [displayUser],
  );

  useEffect(() => {
    let cancelled = false;
    async function loadPdf() {
      setLoading(true);
      setError("");
      try {
        const pdfjsModule = (await import("pdfjs-dist")) as PdfJsModule;
        let pdfjs: PdfJsModule = pdfjsModule;
        if (typeof pdfjs.getDocument !== "function") {
          pdfjs = pdfjsModule.default ?? pdfjsModule;
        }
        if (!pdfjsWorkerReady) {
          try {
            pdfjs.GlobalWorkerOptions.workerSrc = new URL(
              "pdfjs-dist/build/pdf.worker.min.mjs",
              import.meta.url,
            ).toString();
          } catch {
            /* ignore */
          }
          pdfjsWorkerReady = true;
        }
        const blob = await fetch(`/api/book-pdf/${bookId}`, {
          credentials: "include",
        }).then(async (r) => {
          if (r.status === 401) throw new Error("Please sign in to read this book.");
          if (r.status === 403) throw new Error("You have not purchased this book.");
          if (!r.ok) {
            const data = (await r.json().catch(() => ({}))) as { error?: string };
            throw new Error(data.error || "Unable to load the book.");
          }
          return r.blob();
        });
        const doc = await pdfjs
          .getDocument({ data: await blob.arrayBuffer() })
          .promise;
        if (cancelled) return;
        setPdfInstance(doc);
        setTotalPages(doc.numPages);
        setCurrentPage(1);
      } catch (err) {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load book.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    loadPdf();
    return () => {
      cancelled = true;
    };
  }, [bookId]);

  useEffect(() => {
    if (!pdfInstance) return;
    const doc = pdfInstance;
    let cancelled = false;
    async function render() {
      try {
        const page = await doc.getPage(currentPage);
        const viewport = page.getViewport({ scale: currentScale });
        const canvas = canvasRef.current;
        if (!canvas) return;
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (cancelled) return;
        if (!isFree && displayUser?.name) {
          drawWatermark(ctx, viewport.width, viewport.height, displayUser.name);
        }
      } catch {
        /* ignore render errors */
      }
    }
    render();
    return () => {
      cancelled = true;
    };
  }, [pdfInstance, currentPage, currentScale, isFree, displayUser, drawWatermark]);

  useEffect(() => {
    if (!pdfInstance) return;
    const timer = setTimeout(() => {
      publicApi
        .saveReadingProgress({ bookId, page: currentPage })
        .catch(() => {
          /* ignore */
        });
    }, 400);
    return () => clearTimeout(timer);
  }, [currentPage, bookId, pdfInstance]);

  const next = () => setCurrentPage((p) => Math.min(totalPages, p + 1));
  const prev = () => setCurrentPage((p) => Math.max(1, p - 1));

  const goFullscreen = () => {
    const el = containerRef.current;
    if (!el) return;
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(() => {});
    } else {
      el.requestFullscreen().catch(() => {});
    }
  };

  return (
    <div
      ref={containerRef}
      className="relative mx-auto flex w-full max-w-4xl flex-col overflow-hidden rounded-3xl border-2 border-ink/10 bg-ink shadow-2xl"
      onContextMenu={(e) => {
        e.preventDefault();
        return false;
      }}
      onCopy={(e) => e.preventDefault()}
      onCut={(e) => e.preventDefault()}
      onPaste={(e) => e.preventDefault()}
      style={{ userSelect: "none", WebkitUserSelect: "none" }}
    >
      <div className="flex items-center justify-between gap-2 border-b border-white/10 bg-ink px-3 py-2">
        <div className="flex items-center gap-2">
          <button
            onClick={prev}
            disabled={currentPage <= 1}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={next}
            disabled={currentPage >= totalPages}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-white/10 text-white transition-colors hover:bg-white/20 disabled:opacity-30"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
          <span className="text-xs font-semibold text-white/80">
            Page {currentPage} / {totalPages || "–"}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setScale((s) => Math.max(0.5, s - 0.2))}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-white/10 text-white hover:bg-white/20"
          >
            <Minus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setScale((s) => Math.min(3, s + 0.2))}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-white/10 text-white hover:bg-white/20"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={() => setZoomIn((z) => !z)}
            className={`grid h-8 w-8 cursor-pointer place-items-center rounded-lg ${
              zoomIn ? "bg-primary text-white" : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <PersonStanding className="h-4 w-4" />
          </button>
          <button
            onClick={() => setShowBookmark((b) => !b)}
            className={`grid h-8 w-8 cursor-pointer place-items-center rounded-lg ${
              showBookmark
                ? "bg-amber-500 text-white"
                : "bg-white/10 text-white hover:bg-white/20"
            }`}
          >
            <BookMarked className="h-4 w-4" />
          </button>
          <button
            onClick={goFullscreen}
            className="grid h-8 w-8 cursor-pointer place-items-center rounded-lg bg-white/10 text-white hover:bg-white/20"
          >
            {document.fullscreenElement ? (
              <Minimize className="h-4 w-4" />
            ) : (
              <Maximize className="h-4 w-4" />
            )}
          </button>
        </div>
      </div>

      <div className="relative overflow-auto bg-[#525659] p-4" style={{ maxHeight: "75vh" }}>
        {loading && (
          <div className="flex flex-col items-center justify-center gap-3 py-24 text-white/70">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-sm">Loading book…</p>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-white">
            <p className="text-sm font-semibold text-red-300">{error}</p>
          </div>
        )}
        <div className="relative mx-auto w-fit">
          <canvas ref={canvasRef} className="block bg-white shadow-2xl" />
        </div>
      </div>

      <div className="flex items-center justify-between border-t border-white/10 bg-ink px-4 py-2.5 text-xs text-white/70">
        <span className="inline-flex items-center gap-1.5">
          <BookMarked className="h-3.5 w-3.5" />
          Reading progress: {totalPages ? Math.round((currentPage / totalPages) * 100) : 0}%
        </span>
        <span>{bookTitle}</span>
      </div>
    </div>
  );
}
