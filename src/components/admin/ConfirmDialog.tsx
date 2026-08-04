"use client";

interface Props {
  open: boolean;
  title: string;
  message: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmDialog({
  open,
  title,
  message,
  onConfirm,
  onCancel,
}: Props) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onCancel}
    >
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-sm rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-secondary/10">
          <svg
            width="28"
            height="28"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#F3353B"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
          </svg>
        </div>

        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <p className="mt-2 text-sm text-ink-soft">{message}</p>

        <div className="mt-6 flex items-center justify-center gap-3">
          <button
            onClick={onCancel}
            className="cursor-pointer rounded-xl border-2 border-ink/15 bg-white px-5 py-2.5 text-sm font-medium text-ink transition-all hover:bg-mist"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="cursor-pointer rounded-xl bg-secondary px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-secondary/20 transition-all hover:bg-secondary-dark"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

