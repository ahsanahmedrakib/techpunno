"use client";

import Image from "next/image";
import Link from "next/link";
import type { CollectionConfig } from "@/lib/collections";

interface ContactDetailProps {
  record: Record<string, unknown>;
  config: CollectionConfig;
}

export default function ContactDetail({
  record,
  config,
}: ContactDetailProps) {
  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-3">
        <Link
          href="/admin/contacts"
          className="inline-flex items-center gap-1.5 rounded-xl border-2 border-primary/30 bg-white px-4 py-2 text-sm font-medium text-ink transition-all hover:border-primary/60 hover:bg-primary-lighter/50 hover:text-primary shadow-sm"
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          Back
        </Link>
        <h2 className="text-lg font-bold text-ink">{config.singular} Detail</h2>
      </div>

      <div className="rounded-2xl border-2 border-primary/40 bg-white p-6 shadow-sm">
        <div className="space-y-0">
          {config.fields.map((field, idx) => {
            const value = record[field.name];
            if (value === undefined || value === null || value === "") return null;

            return (
              <div
                key={field.name}
                className={`py-4 ${
                  idx !== config.fields.length - 1 ? "border-b border-ink/5" : ""
                }`}
              >
                <p className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-soft/60">
                  {field.label}
                </p>
                {field.type === "textarea" || field.type === "list" ? (
                  <div className="whitespace-pre-wrap rounded-xl bg-cream/50 p-3 text-sm leading-relaxed text-ink">
                    {Array.isArray(value)
                      ? value.join("\n")
                      : String(value)}
                  </div>
                ) : field.type === "image" && typeof value === "string" ? (
                  <div className="flex items-start gap-4">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-xl border border-ink/10 shadow-sm">
                      <Image
                        src={value}
                        alt={field.label}
                        fill
                        sizes="96px"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-sm text-ink">{value}</p>
                      <a
                        href={value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-1 inline-block text-xs font-medium text-primary hover:underline"
                      >
                        Open full size
                      </a>
                    </div>
                  </div>
                ) : (
                  <p className="rounded-xl bg-cream/50 px-3 py-2 text-sm text-ink">
                    {String(value)}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
