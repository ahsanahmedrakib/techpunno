"use client";

import RegistrationForm from "@/features/shared/components/RegistrationForm";
import type { CourseItem } from "@/features/courses/data/courses";
import { api } from "@/lib/api";
import type { StudentRegistrationFormValues } from "@/lib/validation";
import { GraduationCap, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

export default function CourseEnroll({
  course,
  compact,
}: {
  course: CourseItem;
  compact?: boolean;
}) {
  const [open, setOpen] = useState(false);
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
      setOpen(false);
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

  const handleRegister = async (values: StudentRegistrationFormValues) => {
    await api.create("courseregistrations", {
      ...values,
      courseId: course.id,
      courseTitle: course.title,
    });
  };

  const btnCls = compact
    ? "cursor-pointer inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-xs font-semibold text-white transition-all hover:bg-primary-dark"
    : "cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-md shadow-primary/20 transition-all hover:bg-primary-dark";

  return (
    <>
      <button
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setOpen(true);
        }}
        className={btnCls}
      >
        <GraduationCap className="h-4 w-4" />
        Enroll Now
      </button>

      {open &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Course registration form"
            className="fixed inset-0 z-60 flex items-start justify-center overflow-y-auto p-4 sm:p-6"
          >
            <div
              onClick={requestClose}
              className={`fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`relative my-6 w-full max-w-2xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ${
                visible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-10 scale-[0.97] opacity-0"
              }`}
            >
              <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b-2 border-primary/20 bg-white/95 px-6 py-4 backdrop-blur-sm">
                <div>
                  <p className="text-base font-bold text-ink">
                    Course Registration Form
                  </p>
                  <p className="text-xs text-ink-soft">{course.title}</p>
                </div>
                <button
                  onClick={requestClose}
                  aria-label="Close"
                  className="cursor-pointer grid h-10 w-10 shrink-0 place-items-center rounded-xl border border-ink/10 text-ink transition-all hover:border-secondary/50 hover:bg-secondary-light hover:text-secondary"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <div className="max-h-[calc(100vh-8.5rem)] overflow-y-auto p-5 sm:p-8">
                <RegistrationForm
                  title="Enroll in this course"
                  subtitle="Fill in your details to enroll. Your enrollment will be reviewed by our team."
                  submitLabel="Submit Enrollment"
                  onSubmit={handleRegister}
                />
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}