"use client";

import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import type { TeamMember } from "@/data/team";
import { safeImage } from "@/lib/imageUrl";
import Image from "next/image";

export default function TeamCard({
  member,
  index = 0,
}: {
  member: TeamMember;
  index?: number;
}) {
  return (
    <Reveal
      variant="zoom"
      scale={0.9}
      delay={(index % 4) * 120}
      className="h-full"
    >
      <Hoverable className="group h-full rounded-3xl bg-linear-to-br from-primary via-secondary to-primary p-px shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15">
        <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white">
          <div className="relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-primary to-primary-dark">
            {safeImage(member.image) ? (
              <Image
                src={safeImage(member.image)}
                alt={member.name}
                fill
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                className="object-cover transition-transform duration-300 group-hover:scale-105"
              />
            ) : (
              <div className="grid h-full w-full place-items-center text-4xl font-extrabold text-white">
                {member.initials}
              </div>
            )}
          </div>
          <div className="flex flex-1 flex-col items-center px-6 py-6 text-center">
            <h3 className="text-lg font-bold text-ink">{member.name}</h3>
            <span className="mt-2 rounded-full bg-primary-lighter px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
              {member.role}
            </span>
            <p className="mt-3 text-sm leading-relaxed text-ink-soft">
              {member.bio}
            </p>
          </div>
        </div>
      </Hoverable>
    </Reveal>
  );
}

