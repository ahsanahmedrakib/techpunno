"use client";

import { motion } from "framer-motion";
import SectionHeading from "@/components/SectionHeading";
import TeamCard from "@/components/TeamCard";
import { advisors } from "@/data/team";
import { stagger } from "@/lib/motion";

export default function AdvisorTeam() {
  return (
    <section id="advisors" className="section-anchor bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Advisory Board"
          title="Guided by"
          accent="Experts"
          description="Seasoned professionals who mentor TechPunno and keep our work credible, ethical and impactful."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4"
        >
          {advisors.map((member) => (
            <TeamCard key={member.id} member={member} />
          ))}
        </motion.div>
      </div>
    </section>
  );
}
