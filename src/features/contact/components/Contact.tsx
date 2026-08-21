"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { site } from "@/features/shared/data/site";
import { api } from "@/lib/api";
import { scrollToFirstError } from "@/lib/utils";
import {
  contactSchema,
  contactSubjects,
  type ContactFormValues,
} from "@/lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const contactInfo = [
  {
    label: "Email Us",
    value: site.email,
    href: `mailto:${site.email}`,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
    ),
  },
  {
    label: "Call Us",
    value: site.phone,
    href: `tel:${site.phone.replace(/[^+\d]/g, "")}`,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
      </svg>
    ),
  },
  {
    label: "Visit Us",
    value: site.address,
    href: undefined,
    icon: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
        <circle cx="12" cy="10" r="3" />
      </svg>
    ),
  },
  {
    label: "Facebook",
    value: "techpunno",
    href: site.facebook,
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
      </svg>
    ),
  },
];

export default function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting, isSubmitSuccessful },
  } = useForm<ContactFormValues>({
    resolver: yupResolver(contactSchema),
    mode: "onTouched",
  });

  const onSubmit = async (values: ContactFormValues) => {
    try {
      await api.create("contacts", values);
      toast.success("Message sent successfully!");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to send message. Please try again.",
      );
    }
    reset();
  };

  return (
    <section id="contact" className="section-anchor bg-gradient-admin-subtle py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Contact"
          title="Let's build a safer"
          accent="digital world"
          description="Volunteer with us, partner on a campaign, or just say hello — we'd love to hear from you."
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-5">
          <Reveal variant="fade-left" className="space-y-4 lg:col-span-2">
            <div className="rounded-3xl bg-gradient-admin p-8 text-white shadow-2xl shadow-primary/25 sm:p-10">
              <h3 className="text-2xl font-bold">Get in touch</h3>
              <p className="mt-2 text-sm leading-relaxed text-white/85">
                Our team usually replies within 24–48 hours. Prefer social? DM
                us on Facebook anytime.
              </p>
              <Hoverable className="mt-6">
                <a
                  href={site.facebook}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary transition-transform hover:-translate-y-0.5"
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                  >
                    <path d="M22 12a10 10 0 1 0-11.6 9.9v-7H7.9V12h2.5V9.8c0-2.5 1.5-3.9 3.8-3.9 1.1 0 2.2.2 2.2.2v2.4h-1.2c-1.2 0-1.6.8-1.6 1.6V12h2.7l-.4 2.9h-2.3v7A10 10 0 0 0 22 12Z" />
                  </svg>
                  Message on Facebook
                </a>
              </Hoverable>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {contactInfo.map((info) => {
                const inner = (
                  <>
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-gradient-admin-icon text-white">
                      {info.icon}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-xs font-semibold uppercase tracking-widest text-ink-soft">
                        {info.label}
                      </span>
                      <span className="block truncate text-sm font-semibold text-ink">
                        {info.value}
                      </span>
                    </span>
                  </>
                );
                const className =
                  "flex h-full items-center gap-3 rounded-2xl border border-ink/5 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg";
                return info.href ? (
                  <Hoverable key={info.label} className="h-full">
                    <a
                      href={info.href}
                      target={
                        info.href.startsWith("http") ? "_blank" : undefined
                      }
                      rel="noopener noreferrer"
                      className={className}
                    >
                      {inner}
                    </a>
                  </Hoverable>
                ) : (
                  <Hoverable key={info.label} className="h-full">
                    <div className={className}>{inner}</div>
                  </Hoverable>
                );
              })}
            </div>
          </Reveal>

          <Reveal
            variant="fade-right"
            delay={150}
            className="rounded-3xl border-2 border-primary/60 p-6 shadow-xl shadow-ink/5 sm:p-8 lg:col-span-3"
          >
            {isSubmitSuccessful ? (
              <div className="flex h-full flex-col items-center justify-center gap-4 py-16 text-center">
                <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-admin-icon text-3xl text-white">
                  ✅
                </span>
                <h3 className="text-2xl font-bold text-ink">Message sent!</h3>
                <p className="max-w-sm text-sm text-ink-soft">
                  Thank you for reaching out. Our team will get back to you
                  within 24–48 hours.
                </p>
                <button
                  onClick={() => reset()}
                  className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={handleSubmit(onSubmit, (errs) =>
                  scrollToFirstError(errs),
                )}
                noValidate
                className="grid grid-cols-1 gap-5 sm:grid-cols-2"
              >
                <div>
                  <label
                    htmlFor="name"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Full Name
                  </label>
                  <input
                    id="name"
                    type="text"
                    placeholder="Your name"
                    {...register("name")}
                    className={`w-full rounded-xl border bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:ring-2 ${
                      errors.name
                        ? "border-secondary focus:border-secondary focus:ring-secondary/20"
                        : "border-ink/10 focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  {errors.name && (
                    <p className="mt-1.5 text-xs font-medium text-secondary">
                      {errors.name.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Email Address
                  </label>
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    {...register("email")}
                    className={`w-full rounded-xl border bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:ring-2 ${
                      errors.email
                        ? "border-secondary focus:border-secondary focus:ring-secondary/20"
                        : "border-ink/10 focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  {errors.email && (
                    <p className="mt-1.5 text-xs font-medium text-secondary">
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="phone"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Phone{" "}
                    <span className="font-normal text-ink-soft">
                      (optional)
                    </span>
                  </label>
                  <input
                    id="phone"
                    type="tel"
                    placeholder="+880 1XXX-XXXXXX"
                    {...register("phone")}
                    className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
                  />
                </div>

                <div>
                  <label
                    htmlFor="subject"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Subject
                  </label>
                  <select
                    id="subject"
                    {...register("subject")}
                    defaultValue=""
                    className={`w-full rounded-xl border bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:ring-2 ${
                      errors.subject
                        ? "border-secondary focus:border-secondary focus:ring-secondary/20"
                        : "border-ink/10 focus:border-primary focus:ring-primary/20"
                    }`}
                  >
                    <option value="" disabled>
                      Choose a subject
                    </option>
                    {contactSubjects.map((subject) => (
                      <option key={subject} value={subject}>
                        {subject}
                      </option>
                    ))}
                  </select>
                  {errors.subject && (
                    <p className="mt-1.5 text-xs font-medium text-secondary">
                      {errors.subject.message}
                    </p>
                  )}
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor="message"
                    className="mb-1.5 block text-sm font-semibold text-ink"
                  >
                    Message
                  </label>
                  <textarea
                    id="message"
                    rows={5}
                    placeholder="Tell us how you'd like to get involved..."
                    {...register("message")}
                    className={`w-full resize-none rounded-xl border bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:ring-2 ${
                      errors.message
                        ? "border-secondary focus:border-secondary focus:ring-secondary/20"
                        : "border-ink/10 focus:border-primary focus:ring-primary/20"
                    }`}
                  />
                  {errors.message && (
                    <p className="mt-1.5 text-xs font-medium text-secondary">
                      {errors.message.message}
                    </p>
                  )}
                </div>

                <div className="flex flex-col items-start gap-4 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
                  <p className="text-xs text-ink-soft">
                    Your information stays private — we only use it to reply to
                    you.
                  </p>
                  <Hoverable className="w-full sm:w-auto">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-admin px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
                    >
                      {isSubmitting ? "Sending..." : "Send Message"}
                      {!isSubmitting && <span aria-hidden>→</span>}
                    </button>
                  </Hoverable>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
