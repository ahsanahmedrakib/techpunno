"use client";

import SectionHeading from "@/components/common/SectionHeading";
import TeamCard from "@/components/common/TeamCard";
import { coreTeam } from "@/data/team";
import { stagger } from "@/lib/motion";
import { motion } from "framer-motion";

export default function CoreTeam() {
  return (
    <section
      id="team"
      className="section-anchor bg-primary-lighter py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Core Team"
          title="The people behind"
          accent="TechPunno"
          description="A passionate group of volunteers leading programs, content and community across Bangladesh."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {coreTeam.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}

