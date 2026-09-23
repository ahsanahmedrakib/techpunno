"use client";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import { type EventItem } from "@/features/events/data/events";
import { site } from "@/features/shared/data/site";
import { api, type EventTokenInfo } from "@/lib/api";
import { formatDateAndTime, getDateParts } from "@/lib/utils";
import {
  BadgeCheck,
  CheckCircle2,
  ClipboardCopy,
  Download,
  Hourglass,
  Loader2,
  PhoneCall,
  Search,
  ShieldCheck,
  Ticket,
  UserX,
  XCircle,
} from "lucide-react";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { QRCodeCanvas } from "qrcode.react";
import { toast } from "react-toastify";

const steps = [
  "Register",
  "Pending",
  "Admin Approve",
  "Token Generate",
  "Collect Token",
  "Download",
];

type LookupState =
  | { phase: "idle" }
  | { phase: "loading" }
  | { phase: "result"; data: EventTokenInfo }
  | { phase: "error"; message: string };

export default function EventTokenCollector({
  initialEventId,
  verifyToken,
}: {
  initialEventId?: string;
  verifyToken?: string;
}) {
  const [events, setEvents] = useState<EventItem[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [eventId, setEventId] = useState(initialEventId ?? "");
  const [mobile, setMobile] = useState("");
  const [mobileError, setMobileError] = useState("");
  const [state, setState] = useState<LookupState>(() =>
    verifyToken ? { phase: "loading" } : { phase: "idle" },
  );
  const [copied, setCopied] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const tokenCardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    api
      .list<EventItem>("events")
      .then((list) => {
        if (cancelled) return;
        const sorted = [...list].sort(
          (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
        );
        setEvents(sorted);
        if (initialEventId && sorted.some((e) => String(e.id) === String(initialEventId))) {
          setEventId(String(initialEventId));
        }
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      })
      .finally(() => {
        if (!cancelled) setLoadingEvents(false);
      });
    return () => {
      cancelled = true;
    };
  }, [initialEventId]);

  const lookupToken = async (payload: {
    eventId?: string;
    mobile?: string;
    token?: string;
  }) => {
    setState({ phase: "loading" });
    try {
      const data = await api.eventToken(payload);
      setState({ phase: "result", data });
    } catch (err) {
      setState({
        phase: "error",
        message: err instanceof Error ? err.message : "Something went wrong",
      });
    }
  };

  const fetchByToken = (token: string) => {
    api
      .eventToken({ token })
      .then((data) => setState({ phase: "result", data }))
      .catch((err) =>
        setState({
          phase: "error",
          message: err instanceof Error ? err.message : "Something went wrong",
        }),
      );
  };

  useEffect(() => {
    if (verifyToken) fetchByToken(verifyToken);
  }, [verifyToken]);

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const m = mobile.trim();
    if (!/^(01[3-9]\d{8}|\+8801[3-9]\d{8})$/.test(m)) {
      setMobileError("Enter a valid Bangladeshi mobile number (e.g. 017XXXXXXXX)");
      return;
    }
    if (!eventId) {
      toast.error("Please select an event");
      return;
    }
    setMobileError("");
    await lookupToken({ eventId, mobile: m });
  };

  const handleDownloadPDF = async () => {
    const element = tokenCardRef.current;
    if (!element) return;
    setDownloading(true);
    try {
      const html2canvas = (await import("html2canvas-pro")).default;
      const { jsPDF } = await import("jspdf");
      const canvas = await html2canvas(element, {
        scale: 3,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });
      const pdf = new jsPDF({
        unit: "mm",
        format: "a6",
        orientation: "landscape",
        compress: true,
      });
      const pageWidth = 148;
      const pageHeight = 105;
      const imgRatio = canvas.width / canvas.height;
      let imgWidth = pageWidth - 4;
      let imgHeight = imgWidth / imgRatio;
      if (imgHeight > pageHeight - 4) {
        imgHeight = pageHeight - 4;
        imgWidth = imgHeight * imgRatio;
      }
      pdf.addImage(
        canvas.toDataURL("image/jpeg", 0.98),
        "JPEG",
        (pageWidth - imgWidth) / 2,
        (pageHeight - imgHeight) / 2,
        imgWidth,
        imgHeight,
      );
      const name = state.phase === "result" ? state.data.fullName : "Participant";
      pdf.save(`Event_Token_${name.trim().replace(/\s+/g, "_") || "Participant"}.pdf`);
      toast.success("Token downloaded successfully");
    } catch {
      toast.error("Could not generate the token PDF.");
    } finally {
      setDownloading(false);
    }
  };

  const copyToken = async () => {
    if (state.phase !== "result" || !state.data.tokenId) return;
    try {
      await navigator.clipboard.writeText(state.data.tokenId);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      toast.error("Could not copy the token ID.");
    }
  };

  const selectedEvent = useMemo(
    () => events.find((e) => String(e.id) === String(eventId)),
    [events, eventId],
  );

  const result = state.phase === "result" ? state.data : null;
  const verificationUrl = result?.tokenId
    ? `${site.url}/events/collect-token?token=${result.tokenId}`
    : "";

  const cardDate = result
    ? result.approvedAt
      ? formatDateAndTime(result.approvedAt)
      : ""
    : "";
  const eventDate = selectedEvent
    ? `${getDateParts(selectedEvent.date).day} ${getDateParts(selectedEvent.date).month} ${getDateParts(selectedEvent.date).year}`
    : "";

  const tokenAmount = result?.amount
    ? String(result.amount).trim().replace(/^৳\s*/, "")
    : "";
  const amountLabel = tokenAmount ? `৳${tokenAmount}` : "৳ —";

  const inputCls = `w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/50 focus:ring-2 ${
    mobileError
      ? "border-secondary focus:border-secondary focus:ring-secondary/20"
      : "border-ink/10 focus:border-primary focus:ring-primary/20"
  }`;

  return (
    <section className="section-anchor bg-gradient-admin-subtle py-16 lg:py-24">
      <Container className="max-w-5xl">
        <Reveal variant="fade-up">
          <div className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-lighter px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
              <Ticket className="h-3.5 w-3.5" />
              Digital Token System
            </span>
            <h1 className="mx-auto mt-4 max-w-2xl text-3xl font-extrabold text-ink sm:text-4xl">
              Collect Your Event Token
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm leading-relaxed text-ink-soft">
              Enter the mobile number you used while registering and select your
              event. Once the admin approves your registration, your unique
              digital token will be generated automatically.
            </p>
          </div>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-y-3">
            {steps.map((step, i) => (
              <div key={step} className="flex items-center">
                <div className="flex items-center gap-2 rounded-full border-2 border-primary/30 bg-white px-3 py-1.5">
                  <span className="grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-white">
                    {i + 1}
                  </span>
                  <span className="text-[11px] font-semibold text-ink">
                    {step}
                  </span>
                </div>
                {i < steps.length - 1 && (
                  <span className="mx-1 h-0.5 w-4 bg-primary/40 sm:w-6" />
                )}
              </div>
            ))}
          </div>
        </Reveal>

        <Reveal delay={160}>
          <div className="mt-10 overflow-hidden rounded-3xl border-2 border-primary/30 bg-white shadow-xl shadow-primary/10">
            <div className="relative bg-linear-to-r from-[#1a3a68] via-primary to-primary-dark px-6 py-5">
              <div className="pointer-events-none absolute -top-10 -right-10 h-32 w-32 rounded-full bg-white/10 blur-2xl" />
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-white/15 text-white backdrop-blur-sm">
                  <Search className="h-5 w-5" />
                </span>
                <div>
                  <p className="text-base font-bold text-white">
                    {verifyToken ? "Verify Token" : "Find My Token"}
                  </p>
                  <p className="text-xs text-white/75">
                    {verifyToken
                      ? "Scan the QR code or paste the token link to verify."
                      : "Use the mobile number from your registration."}
                  </p>
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-8">
              {verifyToken ? (
                <>
                  {state.phase === "loading" && (
                    <div className="flex items-center justify-center gap-2 py-12 text-sm text-ink-soft">
                      <Loader2 className="h-5 w-5 animate-spin" />
                      Verifying token...
                    </div>
                  )}
                  {state.phase === "error" && (
                    <div className="rounded-2xl border-2 border-secondary/30 bg-secondary-light/40 p-8 text-center">
                      <XCircle className="mx-auto h-10 w-10 text-secondary" />
                      <p className="mt-3 text-sm font-medium text-secondary">
                        {state.message}
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <form onSubmit={handleLookup} noValidate className="space-y-5">
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-ink">
                        Event <span className="text-secondary">*</span>
                      </label>
                      <select
                        value={eventId}
                        onChange={(e) => {
                          setEventId(e.target.value);
                          setState({ phase: "idle" });
                        }}
                        className={`${inputCls} appearance-none bg-white pr-10`}
                      >
                        <option value="" disabled>
                          {loadingEvents
                            ? "Loading events..."
                            : "Select an event"}
                        </option>
                        {events.map((e) => (
                          <option key={e.id} value={e.id}>
                            {e.title}
                            {e.location ? ` - ${e.location}` : ""}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-sm font-semibold text-ink">
                        Mobile Number{" "}
                        <span className="text-secondary">*</span>
                      </label>
                      <input
                        type="tel"
                        value={mobile}
                        onChange={(e) => setMobile(e.target.value)}
                        placeholder="017XXXXXXXX"
                        className={inputCls}
                      />
                      {mobileError && (
                        <p className="mt-1.5 text-xs font-medium text-secondary">
                          {mobileError}
                        </p>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={state.phase === "loading"}
                    className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                  >
                    {state.phase === "loading" ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Checking registration...
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-4 w-4" />
                        Get Token
                      </>
                    )}
                  </button>
                </form>
              )}

              {state.phase === "loading" && !verifyToken && (
                <div className="mt-6 flex items-center justify-center gap-2 py-8 text-sm text-ink-soft">
                  <Loader2 className="h-5 w-5 animate-spin" />
                  Looking up your registration...
                </div>
              )}

              {state.phase === "error" && (
                <div className="mt-6 rounded-2xl border-2 border-dashed border-secondary/40 bg-secondary-light/40 p-8 text-center">
                  <XCircle className="mx-auto h-10 w-10 text-secondary" />
                  <p className="mt-3 text-sm font-medium text-secondary">
                    {state.message}
                  </p>
                </div>
              )}

              {result && result.status !== "approved" && (
                <div className="mt-6 rounded-2xl border-2 border-dashed border-amber-400/60 bg-amber-50 p-8 text-center">
                  <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-amber-100 text-amber-600">
                    {result.status === "pending" ? (
                      <Hourglass className="h-8 w-8" />
                    ) : (
                      <UserX className="h-8 w-8" />
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-bold text-ink">
                    {result.status === "pending"
                      ? "Your registration is pending approval"
                      : "Your registration was rejected"}
                  </h3>
                  <p className="mx-auto mt-2 max-w-md text-sm leading-relaxed text-ink-soft">
                    {result.status === "pending"
                      ? "Once the admin approves your registration, your unique digital token will be generated automatically. Please check back later."
                      : "Your event registration was rejected. Please contact the admin for assistance."}
                  </p>
                </div>
              )}

              {result && result.status === "approved" && (
                <div className="mt-6">
                  <div className="mb-5 flex flex-col items-center justify-between gap-3 sm:flex-row">
                    <div className="inline-flex items-center gap-2 rounded-full bg-primary-lighter px-4 py-2 text-xs font-bold text-primary">
                      <BadgeCheck className="h-4 w-4" />
                      Approved — Token generated successfully
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={copyToken}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg border-2 border-primary/40 bg-white px-4 py-2 text-xs font-semibold text-ink transition-all hover:bg-primary-lighter hover:text-primary"
                      >
                        {copied ? (
                          <>
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            Copied
                          </>
                        ) : (
                          <>
                            <ClipboardCopy className="h-3.5 w-3.5" />
                            Copy Token ID
                          </>
                        )}
                      </button>
                      <button
                        onClick={handleDownloadPDF}
                        disabled={downloading}
                        className="cursor-pointer inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-white shadow-md shadow-primary/25 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                      >
                        {downloading ? (
                          <>
                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                            Preparing...
                          </>
                        ) : (
                          <>
                            <Download className="h-3.5 w-3.5" />
                            Download Token (PDF)
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                    <div
                      ref={tokenCardRef}
                      className="relative mx-auto flex h-[460px] w-[720px] max-w-full select-none overflow-hidden rounded-2xl border-2 border-amber-500/60 bg-white font-sans text-ink shadow-xl shadow-primary/20"
                    >
                      <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-white via-amber-50/40 to-white" />

                      <div className="relative z-10 flex w-[240px] shrink-0 flex-col justify-between bg-linear-to-br from-[#1a3a68] to-primary-dark p-5">
                        <div className="flex items-center gap-2">
                          <span className="relative h-9 w-9 shrink-0 overflow-hidden rounded-lg border-2 border-white/30 bg-white">
                            <Image
                              src={site.logo}
                              alt={`${site.name} logo`}
                              fill
                              sizes="36px"
                              className="object-cover"
                            />
                          </span>
                          <div>
                            <p className="text-sm font-extrabold tracking-tight text-white">
                              {site.name}
                            </p>
                            <p className="text-[8px] font-bold uppercase tracking-[0.2em] text-amber-300">
                              Admission Token
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-col items-center">
                          <div className="rounded-xl border-2 border-white/25 bg-white p-2 shadow-lg shadow-black/20">
                            {verificationUrl && (
                              <QRCodeCanvas
                                value={verificationUrl}
                                size={94}
                                level="M"
                                bgColor="#ffffff"
                                fgColor="#1a3a68"
                              />
                            )}
                          </div>
                          <p className="mt-2 text-[9px] font-bold uppercase tracking-[0.25em] text-white/75">
                            Scan to verify
                          </p>
                        </div>

                        <div>
                          <p className="text-[9px] font-bold uppercase tracking-widest text-white/60">
                            Token ID
                          </p>
                          <p className="mt-1 rounded-lg bg-amber-400 px-3 py-2 text-center text-sm font-extrabold tracking-wider text-[#1a3a68]">
                            {result.tokenId}
                          </p>
                        </div>
                      </div>

                      <div className="relative z-10 w-3 shrink-0 bg-ink/[0.03]">
                        <div className="absolute left-1/2 top-3 bottom-3 w-px -translate-x-1/2 border-l-2 border-dashed border-ink/20" />
                        <div className="absolute -top-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-cream ring-2 ring-amber-500/40" />
                        <div className="absolute -bottom-2 left-1/2 h-5 w-5 -translate-x-1/2 rounded-full bg-cream ring-2 ring-amber-500/40" />
                      </div>

                      <div className="relative z-10 flex min-w-0 flex-1 flex-col">
                        <div className="flex items-start justify-between gap-3 border-b-2 border-dashed border-ink/15 px-5 pt-4 pb-3">
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-primary">
                              Event Admission
                            </p>
                            <p className="mt-0.5 line-clamp-2 text-base font-extrabold leading-tight text-ink">
                              {result.eventTitle}
                            </p>
                          </div>
                          <div className="flex shrink-0 flex-col items-end">
                            <p className="text-[9px] font-bold uppercase tracking-widest text-ink-soft/70">
                              Amount
                            </p>
                            <p className="mt-1 rounded-lg bg-amber-400 px-3 py-1 text-lg font-extrabold leading-none text-[#1a3a68]">
                              {amountLabel}
                            </p>
                          </div>
                        </div>

                        <div className="flex-1 px-5 pt-3.5">
                          <div className="grid grid-cols-2 gap-x-5 gap-y-2.5">
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-widest text-ink-soft/60">
                                Participant
                              </p>
                              <p className="mt-0.5 truncate text-[13px] font-bold text-ink">
                                {result.fullName}
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-widest text-ink-soft/60">
                                Class
                              </p>
                              <p className="mt-0.5 truncate text-[13px] font-semibold text-ink">
                                {result.className || "\u2014"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-widest text-ink-soft/60">
                                Institution
                              </p>
                              <p className="mt-0.5 truncate text-[13px] font-semibold text-ink">
                                {result.institution || "\u2014"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-widest text-ink-soft/60">
                                Mobile
                              </p>
                              <p className="mt-0.5 truncate text-[13px] font-semibold text-ink">
                                {result.mobile}
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-widest text-ink-soft/60">
                                Event Date
                              </p>
                              <p className="mt-0.5 truncate text-[13px] font-semibold text-ink">
                                {eventDate || "\u2014"}
                              </p>
                            </div>
                            <div>
                              <p className="text-[8px] font-bold uppercase tracking-widest text-ink-soft/60">
                                Issued On
                              </p>
                              <p className="mt-0.5 truncate text-[13px] font-semibold text-ink">
                                {cardDate || "\u2014"}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-3 px-5 pb-4 pt-2">
                          <p className="flex min-w-0 items-center gap-1.5 text-[9px] font-semibold text-ink-soft">
                            <ShieldCheck className="h-3 w-3 shrink-0 text-primary" />
                            <span className="truncate">
                              Verified by {site.name}
                            </span>
                          </p>
                          <p className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-amber-600">
                            Admit with mobile no.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <p className="mx-auto mt-5 max-w-md text-center text-xs leading-relaxed text-ink-soft">
                    Present this token (QR or PDF) at the event venue.
                    Have your registration mobile number ready for verification.
                  </p>
                </div>
              )}

              {state.phase !== "loading" &&
                state.phase === "idle" &&
                !verifyToken && (
                  <p className="mx-auto mt-5 max-w-md text-center text-sm leading-relaxed text-ink-soft">
                    <PhoneCall className="mr-1 inline h-4 w-4 text-primary" />
                    Token is issued only after the admin approves your
                    registration.
                  </p>
                )}
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}