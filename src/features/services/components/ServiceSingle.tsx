"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import { type Service } from "@/features/services/data/services";
import { useState } from "react";
import { ArrowLeft, CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import Link from "next/link";
import ServiceRequestForm from "./ServiceRequestForm";

export default function ServiceSingle({ service }: { service: Service }) {
  const [showRequestForm, setShowRequestForm] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  return (
    <Container className="py-16 lg:py-24">
      <Reveal variant="fade-left">
        <Link
          href="/services"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          <ArrowLeft size={15} /> Back to Services
        </Link>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-8 flex items-center gap-4">
          <span className="grid h-16 w-16 place-items-center rounded-2xl bg-primary-lighter text-4xl">
            {service.icon}
          </span>
          <div>
            <h1 className="text-3xl font-bold leading-tight text-ink sm:text-4xl">
              {service.title}
            </h1>
            <p className="mt-1 text-sm font-semibold text-primary">
              Service Charge: {service.charge}
            </p>
          </div>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <div className="mt-8 overflow-hidden rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-sm sm:p-8">
          <div className="prose prose-lg max-w-none text-ink-soft prose-headings:text-ink">
            {service.fullDescription.split("\n\n").map((para, i) => (
              <p key={i}>{para}</p>
            ))}
          </div>
        </div>
      </Reveal>

      <div className="mt-12 grid grid-cols-1 gap-8 lg:grid-cols-2">
        <Reveal delay={200} variant="fade-left">
          <div>
            <h2 className="text-2xl font-bold text-ink">What We Offer</h2>
            <div className="mt-6 space-y-4">
              {service.features.map((feature, i) => (
                <div
                  key={i}
                  className="rounded-2xl border border-ink/5 bg-white p-5 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-md"
                >
                  <div className="flex items-start gap-3">
                    <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-primary" />
                    <div>
                      <h3 className="font-bold text-ink">{feature.title}</h3>
                      <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={250} variant="fade-right">
          <div>
            <h2 className="text-2xl font-bold text-ink">How It Works</h2>
            <div className="mt-6 space-y-4">
              {service.process.map((step) => (
                <div
                  key={step.step}
                  className="flex items-start gap-4 rounded-2xl border border-ink/5 bg-white p-5 shadow-sm"
                >
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary text-sm font-bold text-white">
                    {step.step}
                  </span>
                  <div>
                    <h3 className="font-bold text-ink">{step.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-ink-soft">
                      {step.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
      </div>

      <Reveal delay={300}>
        <div className="mt-12 rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-sm sm:p-8">
          <h2 className="text-2xl font-bold text-ink">Who Is This For?</h2>
          <ul className="mt-4 space-y-3">
            {service.whoItsFor.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-primary" />
                <span className="text-sm leading-relaxed text-ink-soft">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Reveal>

      <Reveal delay={350}>
        <div className="mt-12">
          <h2 className="text-2xl font-bold text-ink">
            Frequently Asked Questions
          </h2>
          <div className="mt-6 space-y-3">
            {service.faqs.map((faq, i) => (
              <div
                key={i}
                className="overflow-hidden rounded-2xl border border-ink/5 bg-white shadow-sm"
              >
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="cursor-pointer flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <span className="font-semibold text-ink">{faq.question}</span>
                  {openFaq === i ? (
                    <ChevronUp className="h-5 w-5 shrink-0 text-ink-soft" />
                  ) : (
                    <ChevronDown className="h-5 w-5 shrink-0 text-ink-soft" />
                  )}
                </button>
                {openFaq === i && (
                  <div className="border-t border-ink/5 px-5 pb-5 pt-4">
                    <p className="text-sm leading-relaxed text-ink-soft">
                      {faq.answer}
                    </p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </Reveal>

      <Reveal delay={400}>
        <div className="mt-12 text-center">
          <Hoverable>
            <button
              onClick={() => setShowRequestForm(true)}
              className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              Request This Service
              <span aria-hidden>&rarr;</span>
            </button>
          </Hoverable>
        </div>
      </Reveal>

      {showRequestForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-ink/50 p-4 backdrop-blur-sm">
          <div className="animate-panel-in max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl sm:p-8">
            <div className="mb-6 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-bold text-ink">
                  Request Service
                </h3>
                <p className="text-sm text-ink-soft">
                  {service.icon} {service.title}
                </p>
              </div>
              <button
                onClick={() => setShowRequestForm(false)}
                className="cursor-pointer grid h-10 w-10 place-items-center rounded-xl border border-ink/10 text-ink-soft transition-colors hover:bg-ink/5"
              >
                <svg
                  width="18"
                  height="18"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M18 6 6 18" />
                  <path d="m6 6 12 12" />
                </svg>
              </button>
            </div>
            <ServiceRequestForm
              serviceName={service.title}
              onClose={() => setShowRequestForm(false)}
            />
          </div>
        </div>
      )}
    </Container>
  );
}
