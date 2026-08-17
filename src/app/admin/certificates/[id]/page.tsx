"use client";

import CertificateDetail from "@/components/admin/CertificateDetail";
import Loading from "@/components/common/Loading";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function CertificateDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: row,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["table", "certificates", id],
    queryFn: () => api.get<Record<string, unknown>>("certificates", id),
  });

  if (isLoading) {
    return <Loading text="Loading..." />;
  }

  if (error || !row) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mist text-2xl text-ink-soft/30">
          ?
        </div>
        <p className="text-sm font-medium text-ink-soft">
          Certificate not found.
        </p>
        <Link
          href="/admin/certificates"
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-primary/30 bg-white px-4 py-2 text-sm font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter/50 hover:text-primary shadow-sm"
        >
          <ArrowLeft size={15} /> Back to certificates
        </Link>
      </div>
    );
  }

  return <CertificateDetail row={row} />;
}

