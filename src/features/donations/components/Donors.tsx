"use client";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import DonationFormModal from "@/features/donations/components/DonationFormModal";
import { useMergedStaticTable } from "@/lib/api";
import { safeImage } from "@/lib/imageUrl";
import { HandCoins, Heart, MapPin, Target, TrendingUp } from "lucide-react";
import Image from "next/image";
import { useMemo, useState } from "react";

export interface DonationEventItem {
  id: string;
  title: string;
  description?: string;
  target?: number;
  collected?: number;
  slug?: string;
}

export interface DonorItem {
  id: string;
  fullName: string;
  amount?: string;
  eventName?: string;
  anonymous?: string;
  location?: string;
  image?: string;
  status?: string;
}

export default function DonorsAndDonation() {
  const [events] = useMergedStaticTable<DonationEventItem>(
    "donationevents",
    [],
  );
  const [donations] = useMergedStaticTable<DonorItem>("donations", []);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState("");

  const donors = useMemo(() => {
    return donations
      .filter((d) => !d.status || d.status === "approved")
      .map((d) => ({
        ...d,
        anonymous: String(d.anonymous ?? "No") === "Yes",
      }));
  }, [donations]);

  const openDonate = (event = "") => {
    setSelectedEvent(event);
    setModalOpen(true);
  };

  return (
    <section
      id="donors"
      className="section-anchor bg-gradient-admin-subtle py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="Donors & Supporters"
          title="Support the mission of"
          accent="TechPunno"
          description="Thank you to every supporter who helps build a safe digital society across Bangladesh."
        />

        {events.length > 0 && (
          <div className="mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {events.map((evt, i) => {
              const target = Number(evt.target) || 0;
              const collected = Number(evt.collected) || 0;
              const pct =
                target > 0
                  ? Math.min(100, Math.round((collected / target) * 100))
                  : 0;
              return (
                <Reveal
                  key={evt.id}
                  variant="fade-up"
                  delay={(i % 3) * 120}
                  className="h-full"
                >
                  <div className="flex h-full flex-col rounded-3xl bg-linear-to-br from-primary/10 to-secondary/10 p-6 ring-1 ring-ink/5">
                    <div className="flex items-start justify-between">
                      <span className="inline-flex items-center gap-2 rounded-full bg-primary-lighter px-3 py-1 text-xs font-bold text-primary">
                        <Target className="h-3.5 w-3.5" />
                        {evt.title}
                      </span>
                      <TrendingUp className="h-5 w-5 text-primary" />
                    </div>
                    {evt.description && (
                      <p className="mt-3 text-sm text-ink-soft">
                        {evt.description}
                      </p>
                    )}
                    <div className="mt-4 flex items-center justify-between text-sm">
                      <span className="font-semibold text-ink">
                        ৳{collected.toLocaleString()}
                      </span>
                      <span className="text-xs text-ink-soft">
                        of ৳{target.toLocaleString()} target
                      </span>
                    </div>
                    <div className="mt-2 h-2.5 w-full overflow-hidden rounded-full bg-white">
                      <div
                        className="h-full rounded-full bg-linear-to-r from-primary to-secondary transition-all"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-right text-xs font-bold text-primary">
                      {pct}% collected
                    </p>
                    <button
                      onClick={() => openDonate(evt.title)}
                      className="mt-4 flex cursor-pointer items-center justify-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
                    >
                      <Heart className="h-4 w-4" />
                      Support This Event
                    </button>
                  </div>
                </Reveal>
              );
            })}
          </div>
        )}

        <div className="mb-10 text-center">
          <button
            onClick={() => openDonate()}
            className="inline-flex cursor-pointer items-center gap-2 rounded-2xl bg-gradient-admin px-8 py-4 text-base font-bold text-white shadow-2xl shadow-primary/20 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
          >
            <Heart className="h-5 w-5" />
            Donate / Support TechPunno
          </button>
        </div>

        {donors.length > 0 && (
          <div>
            <Reveal variant="blur" className="mb-6 text-center">
              <h3 className="text-xl font-bold uppercase tracking-tight text-ink">
                Our <span className="text-gradient">Supporters</span>
              </h3>
            </Reveal>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {donors.map((donor, i) => {
                const displayName = donor.anonymous
                  ? "Anonymous Donor"
                  : donor.fullName;
                return (
                  <Reveal
                    key={donor.id}
                    variant="fade-up"
                    delay={(i % 4) * 100}
                    className="h-full"
                  >
                    <div className="flex h-full flex-col items-center rounded-3xl bg-mist p-6 text-center ring-1 ring-ink/5 transition-all hover:-translate-y-1 hover:shadow-lg">
                      <div className="relative h-16 w-16 overflow-hidden rounded-full bg-gradient-admin ring-2 ring-white shadow">
                        {!donor.anonymous && safeImage(donor.image) ? (
                          <Image
                            src={safeImage(donor.image)}
                            alt={displayName}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center">
                            <HandCoins className="h-7 w-7 text-white/70" />
                          </div>
                        )}
                      </div>
                      <h4 className="mt-3 flex items-center gap-1.5 font-semibold text-ink">
                        {displayName}
                      </h4>
                      {donor.eventName && (
                        <span className="mt-1 inline-flex items-center gap-1 rounded-full bg-primary-lighter px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                          <Heart className="h-3 w-3" />
                          {donor.eventName}
                        </span>
                      )}
                      {donor.location && (
                        <span className="mt-2 inline-flex items-center gap-1 text-xs text-ink-soft">
                          <MapPin className="h-3 w-3" />
                          {donor.location}
                        </span>
                      )}
                    </div>
                  </Reveal>
                );
              })}
            </div>
          </div>
        )}
      </Container>

      <DonationFormModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        events={events}
        selectedEvent={selectedEvent}
      />
    </section>
  );
}

