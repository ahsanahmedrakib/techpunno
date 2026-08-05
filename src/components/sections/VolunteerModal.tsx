"use client";

import VolunteerForm from "@/components/sections/VolunteerForm";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { useEffect } from "react";

export default function VolunteerModal({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKey);
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Volunteer registration form"
          className="fixed inset-0 z-60 flex items-start justify-center overflow-y-auto p-4 sm:p-6"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.97 }}
            transition={{ duration: 0.3 }}
            className="relative my-6 w-full max-w-6xl overflow-hidden rounded-3xl bg-white shadow-2xl"
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
                onClick={onClose}
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
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

