"use client";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import Skeleton from "@/components/common/Skeleton";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { GraduationCap, HeartHandshake } from "lucide-react";
import Image from "next/image";

interface VolunteerRow {
  id: string;
  fullName?: string;
  institute?: string;
  educationLevel?: string;
  membershipType?: string;
  image?: string;
  status?: string;
  createdAt?: string;
}

export default function VolunteersGrid() {
  const { data, isLoading } = useQuery({
    queryKey: ["volunteers", "approved"],
    queryFn: async () => {
      const rows = await api.list<VolunteerRow>("volunteers");
      return rows
        .filter((r) => r.status === "approved")
        .sort(
          (a, b) =>
            new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime(),
        );
    },
  });

  return (
    <section id="volunteers" className="section-anchor bg-cream py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Our Family"
          title="Meet our"
          accent="volunteers"
          description="The passionate people building a safer digital society. Every member shown here is verified and approved by our team."
        />

        {isLoading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl border border-ink/5 bg-white p-6 shadow-sm"
              >
                <Skeleton className="mx-auto mb-4 h-20 w-20 rounded-full" />
                <Skeleton className="mx-auto mb-2 h-5 w-2/3" />
                <Skeleton className="mx-auto mb-2 h-4 w-1/2" />
                <Skeleton className="mx-auto h-4 w-3/4" />
              </div>
            ))}
          </div>
        ) : !data || data.length === 0 ? (
          <div className="mx-auto max-w-lg rounded-3xl border-2 border-dashed border-primary/30 bg-white p-10 text-center">
            <div className="mx-auto mb-4 grid h-14 w-14 place-items-center rounded-full bg-primary-lighter text-primary">
              <HeartHandshake className="h-7 w-7" />
            </div>
            <h3 className="text-lg font-bold text-ink">
              No approved volunteers yet
            </h3>
            <p className="mt-2 text-sm text-ink-soft">
              Once registrations are verified and approved by the team, they
              will appear here. Register below to become the first!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {data.map((member, i) => (
              <Reveal
                key={member.id}
                variant={i % 2 === 0 ? "fade-up" : "zoom"}
                delay={(i % 3) * 100}
                className="group relative overflow-hidden rounded-3xl border-2 border-primary/20 bg-white p-6 text-center shadow-sm transition-all hover:-translate-y-1.5 hover:border-primary/50 hover:shadow-2xl hover:shadow-primary/10"
              >
                <div className="pointer-events-none absolute -top-10 -right-10 h-28 w-28 rounded-full bg-primary-lighter/70 blur-2xl transition-opacity opacity-0 group-hover:opacity-100" />
                <div className="relative mx-auto mb-4 h-20 w-20 overflow-hidden rounded-full border-2 border-primary/30 bg-linear-to-br from-primary to-primary-dark shadow-lg shadow-primary/20">
                  {member.image ? (
                    <Image
                      src={member.image}
                      alt={member.fullName ?? "Volunteer"}
                      fill
                      sizes="80px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="grid h-full w-full place-items-center text-2xl font-extrabold text-white">
                      {(member.fullName ?? "V").trim().charAt(0).toUpperCase()}
                    </div>
                  )}
                </div>
                <h3 className="text-base font-bold text-ink">
                  {member.fullName}
                </h3>
                <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-primary-lighter px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
                  <HeartHandshake className="h-3 w-3" />
                  {member.membershipType ?? "Volunteer"}
                </span>
                <div className="mt-4 space-y-1.5">
                  <p className="flex items-center justify-center gap-1.5 text-sm font-medium text-ink-soft">
                    <GraduationCap className="h-4 w-4 shrink-0 text-primary" />
                    <span className="truncate">{member.institute}</span>
                  </p>
                  <p className="text-xs font-semibold text-ink-soft/70">
                    {member.educationLevel ?? "Member"}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        )}
      </Container>
    </section>
  );
}
