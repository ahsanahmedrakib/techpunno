"use client";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { SkeletonTeamCard } from "@/components/common/Skeleton";
import { useMergedStaticTable } from "@/lib/api";
import { safeImage } from "@/lib/imageUrl";
import { Briefcase, Clock, Code2 } from "lucide-react";
import Image from "next/image";

export interface ITMemberItem {
  id: string;
  name: string;
  role: string;
  post?: string;
  experience?: string;
  bio?: string;
  image?: string;
  initials?: string;
}

export default function ITTeam() {
  const [members] = useMergedStaticTable<ITMemberItem>("itteam", []);

  if (members.length === 0) return null;

  return (
    <section id="it-team" className="section-anchor bg-gradient-admin-subtle py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Meet Our IT Team"
          title="The people building"
          accent="TechPunno"
          description="The technical minds who design, develop and maintain the TechPunno platform and programs."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {members.length === 0 ? (
            <>
              <SkeletonTeamCard />
              <SkeletonTeamCard />
              <SkeletonTeamCard />
              <SkeletonTeamCard />
            </>
          ) : (
            members.map((member, index) => (
              <Reveal
                key={member.id}
                variant="zoom"
                scale={0.9}
                delay={(index % 4) * 120}
                className="h-full"
              >
                <div className="group h-full rounded-3xl bg-gradient-admin p-0.5 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-white">
                    <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-1 bg-gradient-admin opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <div className="relative aspect-4/3 w-full overflow-hidden bg-mist">
                      {safeImage(member.image) ? (
                        <Image
                          src={safeImage(member.image)}
                          alt={member.name}
                          fill
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                          className="object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      ) : (
                        <div className="grid h-full w-full place-items-center bg-linear-to-br from-primary via-primary-dark to-[#06402a]">
                          <Code2 className="h-12 w-12 text-white/40" />
                        </div>
                      )}
                    </div>
                    <div className="flex flex-1 flex-col items-center px-6 py-6 text-center">
                      <h3 className="text-lg font-bold text-ink">{member.name}</h3>
                      <span className="mt-1 text-sm font-semibold text-primary">
                        {member.post || member.role}
                      </span>
                      <div className="mt-3 grid w-full gap-2 text-xs text-ink-soft">
                        {member.role && (
                          <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-cream px-3 py-1.5">
                            <Briefcase className="h-3.5 w-3.5 text-primary" />
                            {member.role}
                          </span>
                        )}
                        {member.experience && (
                          <span className="inline-flex items-center justify-center gap-2 rounded-lg bg-cream px-3 py-1.5">
                            <Clock className="h-3.5 w-3.5 text-primary" />
                            {member.experience}
                          </span>
                        )}
                      </div>
                      {member.bio && (
                        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                          {member.bio}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}
