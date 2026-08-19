"use client";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import VolunteerModal from "@/features/volunteers/components/VolunteerModal";
import VolunteersGrid from "@/features/volunteers/components/VolunteersGrid";
import { ClipboardList, HeartHandshake } from "lucide-react";
import { useState } from "react";

export default function VolunteerPage() {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <main>
        <VolunteersGrid />

        <section className="bg-white py-10" id="registration">
          <Container>
            <Reveal
              variant="zoom"
              scale={0.95}
              className="relative overflow-hidden rounded-3xl bg-linear-to-br from-primary via-primary-dark to-[#06402a] p-4 text-center text-white shadow-2xl shadow-primary/20 sm:p-6"
            >
              <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/5 blur-3xl" />
              <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest">
                <HeartHandshake className="h-4 w-4" />
                Ready to make a difference?
              </span>
              <h2 className="mt-5 text-3xl font-extrabold leading-tight sm:text-4xl">
                Take the first step today
              </h2>
              <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-white/85 sm:text-base">
                Fill the registration form — it takes only a few minutes. Our
                team verifies every application, and once approved you will be
                featured on this page.
              </p>
              <button
                onClick={() => setModalOpen(true)}
                className="cursor-pointer mt-8 inline-flex items-center gap-2 rounded-full bg-white px-8 py-3.5 text-sm font-bold text-primary shadow-xl shadow-primary/20 transition-transform hover:-translate-y-0.5"
              >
                <ClipboardList className="h-4 w-4" />
                Start Registration
              </button>
            </Reveal>
          </Container>
        </section>
      </main>

      <VolunteerModal open={modalOpen} onClose={() => setModalOpen(false)} />
    </>
  );
}
