"use client";

import ConfirmDialog from "@/components/admin/ConfirmDialog";
import Certificate from "@/components/common/Certificate";
import { api } from "@/lib/api";
import { formatDate, formatDateAndTime } from "@/lib/utils";
import { ChevronLeft, ExternalLink, Eye, EyeOff, Medal, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-toastify";

interface CertificateDetailProps {
  row: Record<string, unknown>;
}

function percentageColor(percentage: number): string {
  if (percentage >= 90) return "text-emerald-600 border-emerald-500";
  return "text-primary border-primary";
}

export default function CertificateDetail({ row }: CertificateDetailProps) {
  const router = useRouter();
  const [showCertificate, setShowCertificate] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const certificateId = String(row.certificateId ?? "");
  const name = String(row.name ?? "");
  const phone = String(row.phone ?? "");
  const percentage = Number(row.percentage ?? 0);
  const score = Number(row.score ?? 0);
  const total = Number(row.total ?? 0);
  const quizTitle = String(row.quizTitle ?? "Cyber Awareness Quiz");
  const date = String(row.date ?? "");

  const openCertificate = () => {
    if (typeof window !== "undefined" && certificateId) {
      window.open(
        `/certificate/${certificateId}`,
        "_blank",
        "noopener,noreferrer",
      );
    }
  };

  const handleDelete = async () => {
    if (!row.id) return;
    setDeleting(true);
    try {
      await api.remove("certificates", String(row.id));
      toast.success("Certificate deleted");
      router.replace("/admin/certificates");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
      setDeleting(false);
    }
    setConfirmDelete(false);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/certificates"
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-primary/30 bg-white px-4 py-2 text-sm font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter/50 hover:text-primary shadow-sm"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Link>
        <h2 className="text-lg font-bold text-ink">Certificate Detail</h2>
      </div>

      {/* Eye-catching summary card */}
      <div className="overflow-hidden rounded-2xl border-2 border-primary/30 bg-white shadow-sm">
        <div className="relative overflow-hidden bg-linear-to-r from-[#1a3a68] via-[#23497e] to-primary p-8 text-white">
          <div className="absolute -top-16 -right-16 h-48 w-48 rounded-full bg-white/10" />
          <div className="absolute -bottom-24 -left-10 h-56 w-56 rounded-full bg-white/5" />
          <div className="relative flex flex-wrap items-center justify-between gap-6">
            <div className="flex items-center gap-5">
              <div className="grid h-20 w-20 place-items-center rounded-2xl bg-amber-400/20 text-amber-300 shadow-inner ring-1 ring-white/30">
                <Medal className="h-10 w-10" />
              </div>
              <div>
                <p className="text-[11px] font-bold uppercase tracking-[0.2em] text-amber-300">
                  Verified Certificate
                </p>
                <h3 className="mt-1 text-3xl font-extrabold tracking-tight">
                  {name || "Unknown"}
                </h3>
                <p className="mt-1 text-sm text-white/70">{quizTitle}</p>
              </div>
            </div>
            <div className="flex flex-col items-center">
              <div
                className={`grid h-28 w-28 place-items-center rounded-full border-8 bg-white text-3xl font-extrabold shadow-xl ${percentageColor(percentage)}`}
              >
                {percentage}%
              </div>
              <p className="mt-2 text-[11px] font-bold uppercase tracking-wider text-white/70">
                Score {score}/{total}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-px bg-primary/10 sm:grid-cols-2 lg:grid-cols-3">
          <div className="bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
              Certificate ID
            </p>
            <p className="mt-1 font-mono text-sm font-bold text-[#1a3a68]">
              {certificateId || "\u2014"}
            </p>
          </div>
          <div className="bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
              Phone
            </p>
            <p className="mt-1 text-sm font-medium text-ink">
              {phone || "\u2014"}
            </p>
          </div>
          <div className="bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
              Issue Date
            </p>
            <p className="mt-1 text-sm font-medium text-ink">
              {date || formatDate(String(row.createdAt ?? ""))}
            </p>
          </div>
          <div className="bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
              Quiz Title
            </p>
            <p className="mt-1 text-sm font-medium text-ink">
              {quizTitle || "\u2014"}
            </p>
          </div>
          <div className="bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
              Correct Answers
            </p>
            <p className="mt-1 text-sm font-medium text-ink">
              {score} out of {total}
            </p>
          </div>
          <div className="bg-white p-5">
            <p className="text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
              Stored On
            </p>
            <p className="mt-1 text-sm font-medium text-ink">
              {formatDateAndTime(String(row.createdAt ?? ""))}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap gap-3 border-t border-primary/10 bg-cream/50 p-5">
          <button
            type="button"
            onClick={() => setShowCertificate((v) => !v)}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-bold text-white shadow-md shadow-primary/20 transition-all hover:-translate-y-0.5 hover:bg-primary-dark hover:shadow-lg"
          >
            {showCertificate ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showCertificate ? "Hide Certificate" : "View Certificate"}
          </button>
          <button
            type="button"
            onClick={openCertificate}
            disabled={!certificateId}
            className="cursor-pointer inline-flex items-center gap-2 rounded-xl border-2 border-primary/40 bg-white px-5 py-2.5 text-sm font-bold text-primary transition-all hover:border-primary hover:bg-primary-lighter disabled:cursor-not-allowed disabled:opacity-50"
          >
            <ExternalLink className="h-4 w-4" />
            Open Public Link
          </button>
          <button
            type="button"
            onClick={() => setConfirmDelete(true)}
            disabled={deleting || !row.id}
            className="ml-auto cursor-pointer inline-flex items-center gap-2 rounded-xl border-2 border-secondary/40 bg-white px-5 py-2.5 text-sm font-bold text-secondary transition-all hover:border-secondary hover:bg-secondary-light disabled:cursor-not-allowed disabled:opacity-50"
          >
            <Trash2 className="h-4 w-4" />
            {deleting ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>

      {showCertificate && (
        <div className="rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between">
            <h3 className="text-base font-bold text-ink">Actual Certificate</h3>
            <p className="text-xs text-ink-soft">
              {certificateId ? `ID: ${certificateId}` : ""}
            </p>
          </div>
          <div className="flex justify-center overflow-x-auto rounded-xl bg-mist/60 p-4">
            <Certificate
              embed
              name={name}
              percentage={percentage}
              phone={phone}
              date={date || undefined}
              certificateId={certificateId || undefined}
              certificateUrl={
                typeof window !== "undefined" && certificateId
                  ? `${window.location.origin}/certificate/${certificateId}`
                  : undefined
              }
            />
          </div>
        </div>
      )}

      <ConfirmDialog
        open={confirmDelete}
        title="Delete Certificate?"
        message={`This will permanently delete the certificate for ${name || certificateId || "this recipient"}. This action cannot be undone.`}
        onConfirm={handleDelete}
        onCancel={() => setConfirmDelete(false)}
      />
    </div>
  );
}

