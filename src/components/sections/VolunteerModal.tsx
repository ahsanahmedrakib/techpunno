"use client";

import VolunteerForm from "@/components/sections/VolunteerForm";
import { X } from "lucide-react";
import { useEffect, useState } from "react";

export default function VolunteerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    if (!open) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [open]);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    setVisible(false);
    setTimeout(() => {
      setClosing(false);
      onClose();
    }, 250);
  };

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") requestClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  if (!open) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Volunteer registration form"
      className="fixed inset-0 z-60 flex items-start justify-center overflow-y-auto p-4 sm:p-6"
    >
      <div
        onClick={requestClose}
        className={`fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
          visible ? "opacity-100" : "opacity-0"
        }`}
      />
      <div
        className={`relative my-6 w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ${
          visible
            ? "translate-y-0 scale-100 opacity-100"
            : "translate-y-10 scale-[0.97] opacity-0"
        }`}
      >
        <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b-2 border-primary/20 bg-white/95 px-6 py-4 backdrop-blur-sm">
          <div>
            <p className="text-base font-bold text-ink">
              Membership Registration Form
            </p>
            <p className="text-xs text-ink-soft">
              সদস্য রেজিস্ট্রেশন ফরম — সঠিক ও পূর্ণাঙ্গ তথ্য দিন
            </p>
          </div>
          <button
            onClick={requestClose}
            aria-label="Close registration form"
            className="cursor-pointer grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink/10 text-ink transition-all hover:border-secondary/50 hover:bg-secondary-light hover:text-secondary"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div
          data-volunteer-scroll
          className="max-h-[calc(100vh-8.5rem)] overflow-y-auto p-5 sm:p-8"
        >
          <VolunteerForm />
        </div>
      </div>
    </div>
  );
}
