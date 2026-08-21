"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { services } from "@/features/services/data/services";
import Link from "next/link";

export default function Services() {
  return (
    <section className="section-anchor bg-gradient-admin-subtle py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Our Services"
          title="Professional"
          accent="Digital Services"
          description="We offer a range of professional services to help you stay safe and thrive in the digital world."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((service, i) => (
            <Reveal key={service.id} delay={i * 100} variant="fade-up">
              <Link href={`/services/${service.slug}`} className="block h-full">
                <div className="group relative h-full overflow-hidden rounded-3xl bg-gradient-admin p-[2px] transition-all hover:-translate-y-1 hover:shadow-xl">
                  <div className="flex h-full flex-col rounded-[22px] bg-white p-6">
                    <span className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-admin-icon text-3xl text-white">
                      {service.icon}
                    </span>
                    <h3 className="mb-2 text-lg font-bold text-ink transition-colors group-hover:text-primary">
                      {service.title}
                    </h3>
                    <p className="mb-4 flex-1 text-sm leading-relaxed text-ink-soft">
                      {service.description}
                    </p>
                    <p className="mb-4 text-xs font-semibold text-primary">
                      Service Charge: {service.charge}
                    </p>
                    <Hoverable>
                      <span className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-admin px-5 py-2.5 text-sm font-semibold text-white transition-all">
                        View Details &rarr;
                      </span>
                    </Hoverable>
                  </div>
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
