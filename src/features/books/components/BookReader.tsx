"use client";

import { publicApi } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import {
  BookMarked,
  ChevronLeft,
  ChevronRight,
  Maximize,
  Minimize,
  Minus,
  PersonStanding,
  Plus,
} from "lucide-react";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

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

const GAP = 16;
const PADDING = 16;

export default function BookReader({
  bookId,
  bookTitle,
  isFree,
  user,
}: BookReaderProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [pdfInstance, setPdfInstance] = useState<PdfDoc | null>(null);
  const [units, setUnits] = useState<{ width: number; height: number }[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [scale, setScale] = useState(1);
  const [zoomIn, setZoomIn] = useState(false);
  const [showBookmark, setShowBookmark] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [fitScale, setFitScale] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const canvasesRef = useRef<Map<number, HTMLCanvasElement>>(new Map());
  const renderedRef = useRef<Set<number>>(new Set());

  const totalPages = units.length;
  const currentScale = fitScale * scale * (zoomIn ? 1.6 : 1);

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
        const pageUnits = await Promise.all(
          Array.from({ length: doc.numPages }, (_, i) =>
            doc.getPage(i + 1).then((p) => {
              const v = p.getViewport({ scale: 1 });
              return { width: v.width, height: v.height };
            }),
          ),
        );
        if (cancelled) return;
        setPdfInstance(doc);
        setUnits(pageUnits);
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

  const sizes = useMemo(
    () => units.map((u) => ({ w: u.width * currentScale, h: u.height * currentScale })),
    [units, currentScale],
  );

  const recalcFit = useCallback(() => {
    const scroll = scrollRef.current;
    const first = units[0];
    if (!scroll || !first) return;
    const avail = Math.max(120, scroll.clientWidth - 40);
    const f = avail / first.width;
    setFitScale(Math.min(3, Math.max(0.5, f)));
  }, [units]);

  useEffect(() => {
    recalcFit();
  }, [recalcFit]);

  useEffect(() => {
    const onResize = () => recalcFit();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [recalcFit]);

  useEffect(() => {
    recalcFit();
  }, [isFullscreen, recalcFit]);

  const renderPage = useCallback(
    async (num: number) => {
      if (!pdfInstance) return;
      if (renderedRef.current.has(num)) return;
      renderedRef.current.add(num);
      const canvas = canvasesRef.current.get(num);
      if (!canvas) return;
      canvas.width = 0;
      try {
        const page = await pdfInstance.getPage(num);
        const viewport = page.getViewport({ scale: currentScale });
        const dpr = Math.min(window.devicePixelRatio || 1, 2);
        canvas.width = viewport.width * dpr;
        canvas.height = viewport.height * dpr;
        canvas.style.width = `${viewport.width}px`;
        canvas.style.height = `${viewport.height}px`;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        await page.render({ canvasContext: ctx, viewport }).promise;
        if (!isFree && displayUser?.name) {
          drawWatermark(ctx, viewport.width, viewport.height, displayUser.name);
        }
      } catch {
        renderedRef.current.delete(num);
      }
    },
    [pdfInstance, currentScale, isFree, displayUser, drawWatermark],
  );

  const computeTops = useCallback((list: { w: number; h: number }[]) => {
    const tops: number[] = new Array(list.length);
    let acc = PADDING;
    for (let i = 0; i < list.length; i++) {
      tops[i] = acc;
      acc += list[i].h + GAP;
    }
    return tops;
  }, []);

  const processVisible = useCallback(() => {
    const scroll = scrollRef.current;
    if (!scroll || sizes.length === 0) return;
    const tops = computeTops(sizes);
    const scrollTop = scroll.scrollTop;
    const vh = scroll.clientHeight;
    const n = sizes.length;

    const focus = scrollTop + vh / 3;
    let cur = 1;
    for (let i = 0; i < n; i++) {
      if (tops[i] <= focus) cur = i + 1;
      else break;
    }
    setCurrentPage((prev) => (prev === cur ? prev : cur));

    let lo = 0;
    for (let i = 0; i < n; i++) {
      if (tops[i] + sizes[i].h > scrollTop) {
        lo = i;
        break;
      }
    }
    let hi = n - 1;
    for (let i = 0; i < n; i++) {
      if (tops[i] > scrollTop + vh) {
        hi = i - 1;
        break;
      }
    }
    const start = Math.max(0, lo - 1);
    const end = Math.min(n - 1, hi + 1);
    for (let i = start; i <= end; i++) {
      renderPage(i + 1);
    }
  }, [sizes, computeTops, renderPage]);

  useEffect(() => {
    renderedRef.current.clear();
    canvasesRef.current.forEach((cv) => {
      cv.width = 0;
    });
    const raf = requestAnimationFrame(() => processVisible());
    return () => cancelAnimationFrame(raf);
  }, [sizes, units, processVisible]);

  useEffect(() => {
    const scroll = scrollRef.current;
    if (!scroll) return;
    const onScroll = () => processVisible();
    scroll.addEventListener("scroll", onScroll, { passive: true });
    const ro = new ResizeObserver(() => processVisible());
    ro.observe(scroll);
    return () => {
      scroll.removeEventListener("scroll", onScroll);
      ro.disconnect();
    };
  }, [processVisible]);

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

  useEffect(() => {
    const onFullscreen = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFullscreen);
    return () => document.removeEventListener("fullscreenchange", onFullscreen);
  }, []);

  const scrollToPage = useCallback(
    (num: number) => {
      const scroll = scrollRef.current;
      if (!scroll || sizes.length === 0) return;
      const tops = computeTops(sizes);
      scroll.scrollTo({ top: Math.max(0, tops[num - 1] ?? 0), behavior: "smooth" });
    },
    [sizes, computeTops],
  );

  const next = () => scrollToPage(Math.min(totalPages, currentPage + 1));
  const prev = () => scrollToPage(Math.max(1, currentPage - 1));

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

      <div
        ref={scrollRef}
        className={`flex-1 overflow-auto bg-[#525659] ${
          isFullscreen ? "" : "max-h-[75vh]"
        }`}
      >
        {loading && (
          <div className="p-4">
            <div className="relative mx-auto mt-10 aspect-[3/4] w-[78%] max-w-xl overflow-hidden rounded-lg bg-white">
              <div className="absolute inset-0 -translate-x-full animate-shimmer bg-linear-to-r from-transparent via-ink/10 to-transparent" />
            </div>
          </div>
        )}
        {error && (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-white">
            <p className="text-sm font-semibold text-red-300">{error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="mx-auto flex w-fit flex-col items-center gap-4 p-4">
            {sizes.map((s, i) => (
              <div
                key={i}
                className="relative"
                style={{ width: `${s.w}px`, height: `${s.h}px` }}
              >
                <canvas
                  ref={(el) => {
                    if (el) canvasesRef.current.set(i + 1, el);
                    else canvasesRef.current.delete(i + 1);
                  }}
                  className="block h-full w-full bg-white shadow-2xl"
                />
              </div>
            ))}
          </div>
        )}
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