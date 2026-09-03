"use client";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { useMergedStaticTable } from "@/lib/api";
import { safeImage } from "@/lib/imageUrl";
import {
  Award,
  BookOpen,
  Building2,
  GraduationCap,
  Users,
} from "lucide-react";
import Image from "next/image";
import { useMemo } from "react";

export interface QuizWinnerItem {
  id: string;
  quizTitle: string;
  groupName?: string;
  position: string;
  name: string;
  className?: string;
  school?: string;
  photo?: string;
}

const positionRank: Record<string, number> = { "1st": 1, "2nd": 2, "3rd": 3 };

const positionStyles: Record<string, { badge: string; ring: string; icon: string }> = {
  "1st": {
    badge: "bg-amber-400 text-amber-950",
    ring: "ring-amber-400/50",
    icon: "from-amber-400 to-yellow-500",
  },
  "2nd": {
    badge: "bg-slate-300 text-slate-900",
    ring: "ring-slate-300/60",
    icon: "from-slate-300 to-slate-400",
  },
  "3rd": {
    badge: "bg-orange-300 text-orange-950",
    ring: "ring-orange-300/60",
    icon: "from-orange-300 to-orange-400",
  },
};

export default function QuizWinners() {
  const [winners] = useMergedStaticTable<QuizWinnerItem>("quizwinners", []);

  const grouped = useMemo(() => {
    const map = new Map<string, QuizWinnerItem[]>();
    for (const w of winners) {
      const quiz = w.quizTitle || "Quiz";
      const arr = map.get(quiz) ?? [];
      arr.push(w);
      map.set(quiz, arr);
    }
    const result: { quiz: string; winners: QuizWinnerItem[] }[] = [];
    for (const [quiz, list] of map) {
      result.push({ quiz, winners: list });
    }
    return result;
  }, [winners]);

  if (winners.length === 0) return null;

  return (
    <section id="winners" className="section-anchor bg-white py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Quiz Winners"
          title="Celebrating our"
          accent="champions"
          description="Congratulations to the outstanding students who excelled in our quiz competitions. "
        />

        <div className="space-y-14">
          {grouped.map(({ quiz, winners: list }) => {
            const sorted = [...list].sort(
              (a, b) =>
                (positionRank[a.position] ?? 99) - (positionRank[b.position] ?? 99),
            );
            return (
              <div key={quiz}>
                <div className="mb-6 flex flex-col items-center gap-2 text-center">
                  <span className="inline-flex items-center gap-2 rounded-full bg-primary-lighter px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
                    <Award className="h-4 w-4" />
                    {quiz}
                  </span>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {sorted.map((winner, i) => {
                    const style = positionStyles[winner.position] ?? positionStyles["3rd"];
                    const hasGroup = !!winner.groupName;
                    return (
                      <Reveal
                        key={winner.id}
                        variant="zoom"
                        delay={(i % 3) * 120}
                        className="h-full"
                      >
                        <div
                          className={`relative flex h-full flex-col items-center overflow-hidden rounded-3xl bg-white p-8 text-center shadow-sm ring-1 ${style.ring} transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl`}
                        >
                          <div
                            className={`pointer-events-none absolute inset-x-0 top-0 h-1.5 bg-linear-to-r ${style.icon}`}
                          />
                          <span
                            className={`rounded-full px-3 py-1 text-[11px] font-extrabold uppercase tracking-widest ${style.badge}`}
                          >
                            {winner.position} Place
                          </span>

                          <div className="relative mt-5 h-28 w-28 overflow-hidden rounded-full bg-mist ring-4 ring-white shadow-lg">
                            {safeImage(winner.photo) ? (
                              <Image
                                src={safeImage(winner.photo)}
                                alt={winner.name}
                                fill
                                sizes="120px"
                                className="object-cover"
                              />
                            ) : (
                              <div className="grid h-full w-full place-items-center bg-gradient-admin">
                                <Users className="h-10 w-10 text-white/70" />
                              </div>
                            )}
                          </div>

                          <h3 className="mt-4 text-lg font-bold text-ink">
                            {winner.name}
                          </h3>

                          <div className="mt-3 grid w-full grid-cols-1 gap-2 text-xs text-ink-soft">
                            {winner.className && (
                              <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-cream px-3 py-2">
                                <GraduationCap className="h-3.5 w-3.5 text-primary" />
                                {winner.className}
                              </span>
                            )}
                            {winner.school && (
                              <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-cream px-3 py-2">
                                <Building2 className="h-3.5 w-3.5 text-primary" />
                                {winner.school}
                              </span>
                            )}
                            {hasGroup && (
                              <span className="inline-flex items-center justify-center gap-2 rounded-xl bg-primary-lighter px-3 py-2 font-semibold text-primary">
                                <BookOpen className="h-3.5 w-3.5" />
                                Group: {winner.groupName}
                              </span>
                            )}
                          </div>
                        </div>
                      </Reveal>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </Container>
    </section>
  );
}
