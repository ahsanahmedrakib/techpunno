"use client";

import ContactDetail from "@/components/admin/ContactDetail";
import Loading from "@/components/common/Loading";
import { api } from "@/lib/api";
import { tables } from "@/lib/tables";
import { useQuery } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function ContactDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const {
    data: row,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["table", "contacts", id],
    queryFn: () => api.get<Record<string, unknown>>("contacts", id),
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
          Contact message not found.
        </p>
        <Link
          href="/admin/contacts"
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-primary/30 bg-white px-4 py-2 text-sm font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter/50 hover:text-primary shadow-sm"
        >
          <ArrowLeft size={15} />
          Back to contacts
        </Link>
      </div>
    );
  }

  return <ContactDetail row={row} config={tables.contacts} />;
}

