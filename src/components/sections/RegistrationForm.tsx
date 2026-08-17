"use client";

import { studentClassOptions } from "@/data/classes";
import { studentRegistrationSchema, type StudentRegistrationFormValues } from "@/lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { Check, Loader2 } from "lucide-react";
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

export default function RegistrationForm({
  title,
  subtitle,
  submitLabel,
  onSubmit,
}: {
  title: string;
  subtitle: string;
  submitLabel: string;
  onSubmit: (values: StudentRegistrationFormValues) => Promise<void>;
}) {
  const [submitted, setSubmitted] = useState(false);
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<StudentRegistrationFormValues>({
    resolver: yupResolver(studentRegistrationSchema),
    mode: "onTouched",
  });

  const submit = async (values: StudentRegistrationFormValues) => {
    try {
      await onSubmit(values);
      setSubmitted(true);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Submission failed");
    }
  };

  if (submitted) {
    return (
      <div className="rounded-2xl border-2 border-primary/40 bg-white p-8 text-center">
        <div className="mx-auto mb-4 grid h-16 w-16 place-items-center rounded-full bg-primary-lighter text-primary">
          <Check className="h-8 w-8" />
        </div>
        <h3 className="text-xl font-bold text-ink">Submitted Successfully!</h3>
        <p className="mt-2 text-sm text-ink-soft">
          Thank you! Your information has been received. It will be reviewed by
          our team and approved shortly.
        </p>
        <button
          onClick={() => {
            reset();
            setSubmitted(false);
          }}
          className="cursor-pointer mt-5 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white transition-all hover:bg-primary-dark"
        >
          Register another
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(submit)} noValidate className="space-y-5">
      <div>
        <h3 className="text-lg font-bold text-ink">{title}</h3>
        <p className="mt-1 text-sm text-ink-soft">{subtitle}</p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Full Name <span className="text-secondary">*</span>
          </label>
          <input
            type="text"
            placeholder="Your full name"
            {...register("fullName")}
            className={inputCls(fieldError(errors, "fullName"))}
          />
          {fieldError(errors, "fullName") && (
            <p className="mt-1.5 text-xs font-medium text-secondary">
              {fieldError(errors, "fullName")}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Father&apos;s Name <span className="text-secondary">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Abdul Karim"
            {...register("fatherName")}
            className={inputCls(fieldError(errors, "fatherName"))}
          />
          {fieldError(errors, "fatherName") && (
            <p className="mt-1.5 text-xs font-medium text-secondary">
              {fieldError(errors, "fatherName")}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Mother&apos;s Name <span className="text-secondary">*</span>
          </label>
          <input
            type="text"
            placeholder="e.g. Fatema Begum"
            {...register("motherName")}
            className={inputCls(fieldError(errors, "motherName"))}
          />
          {fieldError(errors, "motherName") && (
            <p className="mt-1.5 text-xs font-medium text-secondary">
              {fieldError(errors, "motherName")}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Mobile Number <span className="text-secondary">*</span>
          </label>
          <input
            type="tel"
            placeholder="017XXXXXXXX"
            {...register("mobile")}
            className={inputCls(fieldError(errors, "mobile"))}
          />
          {fieldError(errors, "mobile") && (
            <p className="mt-1.5 text-xs font-medium text-secondary">
              {fieldError(errors, "mobile")}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            Class <span className="text-secondary">*</span>
          </label>
          <select
            {...register("className")}
            defaultValue=""
            className={`${inputCls(fieldError(errors, "className"))} appearance-none bg-white pr-10`}
          >
            <option value="" disabled>
              Select your class
            </option>
            {studentClassOptions.map((opt) => (
              <option key={opt} value={opt}>
                {opt}
              </option>
            ))}
          </select>
          {fieldError(errors, "className") && (
            <p className="mt-1.5 text-xs font-medium text-secondary">
              {fieldError(errors, "className")}
            </p>
          )}
        </div>
        <div>
          <label className="mb-1.5 block text-sm font-semibold text-ink">
            School/College Name <span className="text-secondary">*</span>
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

      <button
        type="submit"
        disabled={isSubmitting}
        className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" />
            Submitting...
          </>
        ) : (
          <>
            {submitLabel} <Check className="h-4 w-4" />
          </>
        )}
      </button>
    </form>
  );
}