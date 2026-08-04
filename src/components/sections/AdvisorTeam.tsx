"use client";

import SectionHeading from "@/components/common/SectionHeading";
import TeamCard from "@/components/common/TeamCard";
import SkeletonTeamCard from "@/components/common/Skeleton";
import { advisors, type TeamMember } from "@/data/team";
import { useCollection } from "@/lib/api";

export default function AdvisorTeam() {
  const [members, loading] = useCollection<TeamMember>("advisors", advisors);
  return (
    <section id="advisors" className="section-anchor bg-cream py-20 lg:py-28">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Advisory Board"
          title="Guided by"
          accent="Experts"
          description="Seasoned professionals who mentor TechPunno and keep our work credible, ethical and impactful."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {loading && members.length === 0 ? (
            <>
              <SkeletonTeamCard />
              <SkeletonTeamCard />
              <SkeletonTeamCard />
              <SkeletonTeamCard />
            </>
          ) : (
            members.map((member, index) => (
              <TeamCard key={member.id} member={member} index={index} />
            ))
          )}
        </div>
      </div>
    </section>
  );
}

