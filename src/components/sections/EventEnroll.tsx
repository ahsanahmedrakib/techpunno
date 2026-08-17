"use client";

import RegistrationForm from "@/components/sections/RegistrationForm";
import type { EventItem } from "@/data/events";
import { api } from "@/lib/api";
import type { StudentRegistrationFormValues } from "@/lib/validation";
import {
  CalendarCheck,
  Check,
  Loader2,
  PhoneCall,
  UserPlus,
  X,
} from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-toastify";

type Mode = "register" | "participate" | null;

export default function EventEnroll({
  event,
  compact,
}: {
  event: EventItem;
  compact?: boolean;
}) {
  const [mode, setMode] = useState<Mode>(null);
  const [visible, setVisible] = useState(false);
  const [closing, setClosing] = useState(false);

  const [phone, setPhone] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [phoneSubmitted, setPhoneSubmitted] = useState(false);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const action = params.get("action");
    if (action === "register" || action === "participate") {
      const raf = requestAnimationFrame(() => setMode(action as Mode));
      return () => cancelAnimationFrame(raf);
    }
  }, []);

  useEffect(() => {
    if (!mode) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(raf);
  }, [mode]);

  const requestClose = () => {
    if (closing) return;
    setClosing(true);
    setVisible(false);
    setTimeout(() => {
      setClosing(false);
      setMode(null);
      setPhone("");
      setPhoneError("");
      setPhoneSubmitted(false);
    }, 250);
  };

  useEffect(() => {
    if (!mode) return;
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
  }, [mode]);

  const handleRegister = async (values: StudentRegistrationFormValues) => {
    await api.create("eventregistrations", {
      ...values,
      eventId: event.id,
      eventTitle: event.title,
    });
  };

  const handleParticipate = async (e: React.FormEvent) => {
    e.preventDefault();
    const mobile = phone.trim();
    if (!/^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/.test(mobile)) {
      setPhoneError("Enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX)");
      return;
    }
    setPhoneError("");
    setEnrolling(true);
    try {
      await api.create("enroll", { eventId: event.id, mobile });
      setPhoneSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Enrollment failed");
    } finally {
      setEnrolling(false);
    }
  };

  const baseBtn = compact
    ? "inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg px-2.5 py-2 text-xs font-semibold transition-all"
    : "inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 text-sm font-bold transition-all";

  return (
    <>
      <div className={`flex gap-3 ${compact ? "" : "flex-col sm:flex-row"}`}>
        <button
          onClick={() => setMode("register")}
          className={`${baseBtn} cursor-pointer bg-primary text-white shadow-xl shadow-primary/25 transition-transform hover:-translate-y-0.5 hover:bg-primary-dark`}
        >
          <CalendarCheck className="h-4 w-4" />
          Register for Event
        </button>
        <button
          onClick={() => setMode("participate")}
          className={`${baseBtn} cursor-pointer border-2 border-primary/40 bg-white text-primary transition-all hover:-translate-y-0.5 hover:bg-primary-lighter`}
        >
          <UserPlus className="h-4 w-4" />
          I&apos;m Participating
        </button>
      </div>

      {mode &&
        createPortal(
          <div
            role="dialog"
            aria-modal="true"
            aria-label={mode === "register" ? "Event registration form" : "Event participation"}
            className="fixed inset-0 z-60 flex items-start justify-center overflow-y-auto p-4 sm:p-6"
          >
            <div
              onClick={requestClose}
              className={`fixed inset-0 bg-ink/60 backdrop-blur-sm transition-opacity duration-300 ${
                visible ? "opacity-100" : "opacity-0"
              }`}
            />
            <div
              className={`relative my-6 w-full max-w-3xl overflow-hidden rounded-3xl bg-white shadow-2xl transition-all duration-300 ${
                visible
                  ? "translate-y-0 scale-100 opacity-100"
                  : "translate-y-10 scale-[0.97] opacity-0"
              }`}
            >
              <div className="relative bg-linear-to-r from-[#1a3a68] via-primary to-primary-dark px-6 py-5">
                <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                      {mode === "register" ? (
                        <CalendarCheck className="h-6 w-6" />
                      ) : (
                        <UserPlus className="h-6 w-6" />
                      )}
                    </span>
                    <div>
                      <p className="text-base font-bold text-white">
                        {mode === "register"
                          ? "Event Registration Form"
                          : "Confirm Participation"}
                      </p>
                      <p className="text-xs text-white/75">
                        {event.title}
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={requestClose}
                    aria-label="Close"
                    className="cursor-pointer grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm transition-all hover:bg-white/30"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
              </div>

              <div className="max-h-[calc(100vh-9rem)] overflow-y-auto bg-cream p-5 sm:p-8">
                {mode === "register" ? (
                  <RegistrationForm
                    title="Register for this event"
                    subtitle="Fill in your details to register. Your registration will be reviewed by our team."
                    submitLabel="Submit Registration"
                    onSubmit={handleRegister}
                  />
                ) : phoneSubmitted ? (
                  <div className="rounded-2xl border-2 border-primary/40 bg-white p-10 text-center">
                    <div className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-primary-lighter text-primary">
                      <Check className="h-10 w-10" />
                    </div>
                    <h3 className="text-2xl font-bold text-ink">
                      You are now a participant!
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                      Your participation is confirmed and pending admin approval.
                      See you at the event!
                    </p>
                    <button
                      onClick={requestClose}
                      className="cursor-pointer mt-6 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
                    >
                      Done
                    </button>
                  </div>
                ) : (
                  <div className="mx-auto max-w-xl">
                    <form onSubmit={handleParticipate} noValidate className="space-y-5">
                      <div className="flex items-start gap-4 rounded-2xl border-2 border-primary/40 bg-white p-5">
                        <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-primary-lighter text-primary">
                          <PhoneCall className="h-6 w-6" />
                        </span>
                        <div>
                          <p className="text-lg font-bold text-ink">
                            Are you participating in this event?
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed text-ink-soft">
                            Enter the mobile number you used to register for this
                            event. If it matches our records, you will be added as
                            an official participant.
                          </p>
                        </div>
                      </div>

                      <div>
                        <label className="mb-1.5 block text-sm font-semibold text-ink">
                          Mobile Number <span className="text-secondary">*</span>
                        </label>
                        <input
                          type="tel"
                          value={phone}
                          onChange={(e) => setPhone(e.target.value)}
                          placeholder="017XXXXXXXX"
                          className={`w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/50 focus:ring-2 ${
                            phoneError
                              ? "border-secondary focus:border-secondary focus:ring-secondary/20"
                              : "border-ink/10 focus:border-primary focus:ring-primary/20"
                          }`}
                        />
                        {phoneError && (
                          <p className="mt-1.5 text-xs font-medium text-secondary">
                            {phoneError}
                          </p>
                        )}
                      </div>

                      <button
                        type="submit"
                        disabled={enrolling}
                        className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {enrolling ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin" />
                            Checking registration...
                          </>
                        ) : (
                          <>
                            Confirm Participation <Check className="h-4 w-4" />
                          </>
                        )}
                      </button>
                    </form>
                  </div>
                )}
              </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}