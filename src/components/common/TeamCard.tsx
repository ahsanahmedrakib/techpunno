"use client";

import type { TeamMember } from "@/data/team";
import { fadeUp } from "@/lib/motion";
import { motion } from "framer-motion";
import Image from "next/image";

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group rounded-3xl bg-linear-to-br from-primary via-secondary to-primary p-0.5 shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15"
    >
      <div className="flex h-full flex-col overflow-hidden rounded-3xl bg-white">
        <div className="relative aspect-4/3 w-full overflow-hidden bg-linear-to-br from-primary to-primary-dark">
          {member.image ? (
            <Image
              src={member.image}
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
    </motion.div>
  );
}

