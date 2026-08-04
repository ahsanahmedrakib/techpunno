"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api";
import { collections } from "@/lib/collections";
import ContactDetail from "@/components/admin/ContactDetail";
import Loading from "@/components/common/Loading";

export default function ContactDetailPage() {
  const params = useParams();
  const id = params.id as string;

  const { data: record, isLoading, error } = useQuery({
    queryKey: ["collection", "contacts", id],
    queryFn: () => api.get<Record<string, unknown>>("contacts", id),
  });

  if (isLoading) {
    return <Loading text="Loading..." />;
  }

  if (error || !record) {
    return (
      <div className="flex h-64 flex-col items-center justify-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-mist text-2xl text-ink-soft/30">
          ?
        </div>
        <p className="text-sm font-medium text-ink-soft">Contact message not found.</p>
        <a
          href="/admin/contacts"
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-primary/30 bg-white px-4 py-2 text-sm font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter/50 hover:text-primary shadow-sm"
        >
          ← Back to contacts
        </a>
      </div>
    );
  }

  return <ContactDetail record={record} config={collections.contacts} />;
}
