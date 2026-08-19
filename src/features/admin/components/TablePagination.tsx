"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";

interface TablePaginationProps {
  page: number;
  pageSize: number;
  total: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}

const PAGE_SIZES = [10, 20, 50, 100];

function getPageItems(page: number, totalPages: number): (number | string)[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const candidates = new Set([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...candidates]
    .filter((p) => p >= 1 && p <= totalPages)
    .sort((a, b) => a - b);
  const items: (number | string)[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) items.push(`ellipsis-${p}`);
    items.push(p);
    prev = p;
  }
  return items;
}

const pageButtonClass = (active: boolean) =>
  `cursor-pointer grid h-9 min-w-9 place-items-center rounded-lg px-2 text-sm font-semibold transition-all ${
    active
      ? "bg-primary text-white shadow-md shadow-primary/30"
      : "border border-ink/10 bg-white text-ink hover:border-primary/50 hover:text-primary"
  }`;

export default function TablePagination({
  page,
  pageSize,
  total,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const from = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, total);

  return (
    <div className="flex flex-col items-center justify-between gap-4 border-t border-ink/10 bg-cream/60 px-5 py-4 sm:flex-row">
      <div className="flex items-center gap-3 text-xs text-ink-soft">
        <div className="flex items-center gap-1.5">
          <span>Rows</span>
          <select
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
            className="cursor-pointer rounded-lg border border-ink/10 bg-white px-2 py-1.5 text-xs font-semibold text-ink outline-none transition-colors focus:border-primary"
          >
            {PAGE_SIZES.map((size) => (
              <option key={size} value={size}>
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="font-medium text-xs text-ink-soft">
        Showing {from}-{to} of {total}
      </div>

      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(page - 1)}
          disabled={page <= 1}
          className="cursor-pointer grid h-9 w-9 place-items-center rounded-lg border border-ink/10 bg-white text-ink transition-all hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink/10 disabled:hover:text-ink"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        {getPageItems(page, totalPages).map((item) =>
          typeof item === "string" ? (
            <span
              key={item}
              className="grid h-9 min-w-5 place-items-center px-1 text-xs text-ink-soft/50"
            >
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => onPageChange(item)}
              className={pageButtonClass(item === page)}
            >
              {item}
            </button>
          ),
        )}
        <button
          type="button"
          onClick={() => onPageChange(page + 1)}
          disabled={page >= totalPages}
          className="cursor-pointer grid h-9 w-9 place-items-center rounded-lg border border-ink/10 bg-white text-ink transition-all hover:border-primary/50 hover:text-primary disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-ink/10 disabled:hover:text-ink"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

