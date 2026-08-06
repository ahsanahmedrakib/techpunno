import { missionText } from "@/data/volunteers";
import Reveal from "@/components/common/Reveal";
import {
  ClipboardList,
  HeartHandshake,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";
import Link from "next/link";
import Container from "../common/Container";

const features = [
  {
    icon: Target,
    title: "Real Impact",
    desc: "Lead cyber awareness campaigns in your community.",
  },
  {
    icon: Users,
    title: "Strong Network",
    desc: "Grow with passionate members across the region.",
  },
  {
    icon: ShieldCheck,
    title: "Skill Development",
    desc: "Gain digital, leadership and teamwork skills.",
  },
];

const VolunteerFooter = () => {
  return (
    <div>
      <section className="relative overflow-hidden bg-linear-to-br from-primary via-primary-dark to-[#06402a] pt-32 pb-24 text-white">
        <div className="pointer-events-none absolute -top-24 -right-24 h-96 w-96 rounded-full bg-white/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-24 h-96 w-96 rounded-full bg-secondary/10 blur-3xl" />

        <Container className="relative">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">
            <Reveal variant="fade-left" distance={24}>
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
                <HeartHandshake className="h-4 w-4" />
                Join Tech Punno
              </span>
              <h1 className="mt-5 text-4xl font-extrabold leading-tight tracking-tight sm:text-5xl">
                Become a Volunteer or Ambassador
              </h1>
              <p className="mt-5 max-w-lg text-base leading-relaxed text-white/85 sm:text-lg">
                {missionText.title} — {missionText.body}
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link
                  href={"/volunteers#registration"}
                  className="cursor-pointer inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-bold text-primary shadow-xl shadow-primary/20 transition-transform hover:-translate-y-0.5"
                >
                  <ClipboardList className="h-4 w-4" />
                  Register Now
                </Link>
                <Link
                  href="/volunteers"
                  className="inline-flex items-center justify-center gap-2 rounded-full border-2 border-white/30 px-7 py-3.5 text-sm font-bold text-white transition-all hover:border-white/70 hover:bg-white/10"
                >
                  <Users className="h-4 w-4" />
                  Meet our Volunteers
                </Link>
              </div>
            </Reveal>

            <Reveal
              variant="fade-right"
              distance={24}
              delay={150}
              className="grid grid-cols-1 gap-4"
            >
              <div className="rounded-3xl border border-white/15 bg-white/10 p-7 backdrop-blur-sm">
                <h3 className="text-lg font-bold">🎯 {missionText.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-white/85">
                  {missionText.body}
                </p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {features.map((f) => (
                  <div
                    key={f.title}
                    className="rounded-3xl border border-white/15 bg-white/10 p-5 backdrop-blur-sm"
                  >
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-white/15">
                      <f.icon className="h-5 w-5" />
                    </span>
                    <p className="mt-3 text-sm font-bold">{f.title}</p>
                    <p className="mt-1 text-xs leading-relaxed text-white/75">
                      {f.desc}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
    </div>
  );
};

export default VolunteerFooter;
