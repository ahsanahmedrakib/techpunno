"use client";

import SectionHeading from "@/components/common/SectionHeading";
import TeamCard from "@/components/common/TeamCard";
import SkeletonTeamCard from "@/components/common/Skeleton";
import { coreTeam, type TeamMember } from "@/data/team";
import { useCollection } from "@/lib/api";

export default function CoreTeam() {
  const [members, loading] = useCollection<TeamMember>("coreteam", coreTeam);
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

