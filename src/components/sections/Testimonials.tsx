"use client";

import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { testimonials, type TestimonialItem } from "@/data/testimonials";
import { api, useTable } from "@/lib/api";
import { testimonialSchema, type TestimonialFormValues } from "@/lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, Loader2, MessageSquareQuote, PenLine, Star } from "lucide-react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

function fieldError(errors: object, name: string): string | undefined {
  const key = name as keyof typeof errors;
  const err = (errors as Record<string, { message?: string }>)[key];
  return err?.message;
}

const inputCls = (err?: string) =>
  `w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/50 focus:ring-2 ${
    err
      ? "border-secondary focus:border-secondary focus:ring-secondary/20"
      : "border-ink/10 focus:border-primary focus:ring-primary/20"
  }`;

function Stars({ value }: { value: number }) {
  return (
    <div className="flex gap-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Star
          key={i}
          className={`h-4 w-4 ${
            i <= value ? "fill-amber-400 text-amber-400" : "text-ink/15"
          }`}
        />
      ))}
    </div>
  );
}

export default function Testimonials() {
  const [items] = useTable<TestimonialItem>("testimonials", testimonials);
  const approved = items.filter((t) => t.status === "approved");
  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<TestimonialFormValues>({
    resolver: yupResolver(testimonialSchema),
    mode: "onTouched",
    defaultValues: { rating: 5 },
  });

  // eslint-disable-next-line react-hooks/incompatible-library
  const watchRating = watch("rating");

  const submit = async (values: TestimonialFormValues) => {
    try {
      await api.create("testimonials", { ...values, status: "pending" });
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    }
  };

  return (
    <section id="testimonials" className="section-anchor bg-white py-20 lg:py-28">
      <Container>
        <SectionHeading
          eyebrow="Testimonials"
          title="What students say about"
          accent="TechPunno"
          description="Real voices from the students and communities we work with across Bangladesh."
        />

        {approved.length > 0 && (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {approved.map((t, i) => (
              <Reveal
                key={t.id}
                variant={i % 2 === 0 ? "fade-up" : "zoom"}
                delay={(i % 3) * 120}
                className="h-full"
              >
                <div className="group relative h-full rounded-3xl bg-linear-to-br from-primary/40 via-primary/10 to-secondary/40 p-px shadow-sm transition-all duration-300 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/20">
                  <div className="relative flex h-full flex-col overflow-hidden rounded-[calc(1.5rem-1px)] bg-cream p-6">
                    <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-primary/10 blur-3xl transition-all duration-500 group-hover:bg-secondary/20" />
                    <div className="pointer-events-none absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-secondary to-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                    <span className="absolute top-5 right-5 text-primary/15">
                      <MessageSquareQuote className="h-9 w-9" />
                    </span>
                    <Stars value={t.rating} />
                    <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-soft">
                      &ldquo;{t.message}&rdquo;
                    </p>
                    <div className="mt-5 flex items-center gap-3 border-t border-primary/15 pt-4">
                      <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-linear-to-br from-primary to-secondary text-sm font-bold text-white">
                        {t.name.charAt(0)}
                      </span>
                      <div className="min-w-0">
                        <p className="truncate text-sm font-bold text-ink">
                          {t.name}
                        </p>
                        <p className="mt-0.5 truncate text-xs text-ink-soft">
                          {t.institution}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-12 max-w-2xl mx-auto">
          {submitted ? (
            <div className="rounded-3xl border-2 border-primary/40 bg-cream p-10 text-center">
              <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary-lighter text-primary">
                <Check className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold text-ink">Review Submitted!</h3>
              <p className="mt-2 text-sm text-ink-soft">
                Thank you for your review. It will be published on the website
                after admin approval.
              </p>
              <button
                onClick={() => {
                  reset({ rating: 5 });
                  setSubmitted(false);
                  setShowForm(false);
                }}
                className="cursor-pointer mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
              >
                Done
              </button>
            </div>
          ) : showForm ? (
            <form
              onSubmit={handleSubmit(submit, () => undefined)}
              noValidate
              className="rounded-3xl border-2 border-primary/40 bg-cream p-6 sm:p-8"
            >
              <h3 className="flex items-center gap-2 text-lg font-bold text-ink">
                <PenLine className="h-5 w-5 text-primary" />
                Write a Review
              </h3>
              <p className="mt-1 text-sm text-ink-soft">
                Share your experience with TechPunno programs.
              </p>
              <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">
                    Your Name <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="Your full name"
                    {...register("name")}
                    className={inputCls(fieldError(errors, "name"))}
                  />
                  {fieldError(errors, "name") && (
                    <p className="mt-1.5 text-xs font-medium text-secondary">
                      {fieldError(errors, "name")}
                    </p>
                  )}
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-semibold text-ink">
                    Educational Institution <span className="text-secondary">*</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. XYZ School & College"
                    {...register("institution")}
                    className={inputCls(fieldError(errors, "institution"))}
                  />
                  {fieldError(errors, "institution") && (
                    <p className="mt-1.5 text-xs font-medium text-secondary">
                      {fieldError(errors, "institution")}
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-semibold text-ink">
                  Rating
                </label>
                <div className="flex gap-1" data-field="rating">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() =>
                        setValue("rating", i, { shouldValidate: true })
                      }
                      className="cursor-pointer"
                      aria-label={`${i} star`}
                    >
                      <Star
                        className={`h-7 w-7 transition-colors ${
                          i <= (watchRating ?? 0)
                            ? "fill-amber-400 text-amber-400"
                            : "text-ink/15"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {fieldError(errors, "rating") && (
                  <p className="mt-1 text-xs font-medium text-secondary">
                    {fieldError(errors, "rating")}
                  </p>
                )}
              </div>
              <div className="mt-4">
                <label className="mb-1.5 block text-sm font-semibold text-ink">
                  Your Review <span className="text-secondary">*</span>
                </label>
                <textarea
                  rows={4}
                  placeholder="Tell us about your experience..."
                  {...register("message")}
                  className={`${inputCls(fieldError(errors, "message"))} resize-none`}
                />
                {fieldError(errors, "message") && (
                  <p className="mt-1.5 text-xs font-medium text-secondary">
                    {fieldError(errors, "message")}
                  </p>
                )}
              </div>
              <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="cursor-pointer inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      Submit Review <Check className="h-4 w-4" />
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="cursor-pointer rounded-full border-2 border-primary/30 px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-mist"
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center">
              <button
                onClick={() => setShowForm(true)}
                className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-sm font-bold text-white shadow-xl shadow-primary/25 transition-transform hover:-translate-y-0.5"
              >
                <PenLine className="h-4 w-4" />
                Write a Review
              </button>
            </div>
          )}
        </div>
      </Container>
    </section>
  );
}