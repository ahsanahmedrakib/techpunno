"use client";

import { motion } from "framer-motion";
import type { TeamMember } from "@/data/team";
import { fadeUp } from "@/lib/motion";

export default function TeamCard({ member }: { member: TeamMember }) {
  return (
    <motion.div
      variants={fadeUp}
      className="group relative flex flex-col items-center rounded-3xl border border-ink/5 bg-white px-6 py-8 text-center shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15"
    >
      <div className="absolute inset-x-0 top-0 h-1.5 rounded-t-3xl bg-gradient-to-r from-primary to-secondary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative">
        <div className="grid h-20 w-20 place-items-center rounded-2xl bg-gradient-to-br from-primary to-primary-dark text-2xl font-extrabold text-white shadow-lg shadow-primary/25 transition-transform duration-300 group-hover:scale-105">
          {member.initials}
        </div>
        <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-secondary text-[10px] font-bold text-white">
          ★
        </span>
      </div>
      <h3 className="mt-5 text-lg font-bold text-ink">{member.name}</h3>
      <span className="mt-1 rounded-full bg-primary-lighter px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-primary">
        {member.role}
      </span>
      <p className="mt-3 text-sm leading-relaxed text-ink-soft">{member.bio}</p>
    </motion.div>
  );
}
