"use client";

import Hoverable from "@/components/common/Hoverable";
import { api } from "@/lib/api";
import { scrollToFirstError } from "@/lib/utils";
import {
  serviceRequestSchema,
  type ServiceRequestFormValues,
} from "@/lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

interface ServiceRequestFormProps {
  serviceName: string;
  onClose: () => void;
}

export default function ServiceRequestForm({
  serviceName,
  onClose,
}: ServiceRequestFormProps) {
  const [requestId, setRequestId] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<ServiceRequestFormValues>({
    resolver: yupResolver(serviceRequestSchema),
    mode: "onTouched",
    defaultValues: { service: serviceName },
  });

  const onSubmit = async (values: ServiceRequestFormValues) => {
    try {
      const result = await api.create<{ requestId: string }>(
        "servicerequests",
        values,
      );
      setRequestId(result.requestId);
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to submit request. Please try again.",
      );
    }
  };

  if (requestId) {
    return (
      <div className="flex flex-col items-center gap-4 py-8 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-full bg-gradient-admin-icon text-3xl text-white">
          ✅
        </span>
        <h3 className="text-2xl font-bold text-ink">
          Request Submitted Successfully.
        </h3>
        <p className="max-w-sm text-sm text-ink-soft">
          Your Request ID is:
        </p>
        <span className="rounded-xl border-2 border-primary/30 bg-gradient-admin-icon px-6 py-3 text-lg font-bold tracking-wider text-white">
          {requestId}
        </span>
        <p className="text-xs text-ink-soft">
          Save this ID to check your request status later.
        </p>
        <button
          onClick={onClose}
          className="mt-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark"
        >
          Close
        </button>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit, (errs) => scrollToFirstError(errs))}
      noValidate
      className="space-y-4"
    >
      <div>
        <label
          htmlFor="sr-name"
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          Name
        </label>
        <input
          id="sr-name"
          type="text"
          placeholder="Your full name"
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

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div>
          <label
            htmlFor="sr-phone"
            className="mb-1.5 block text-sm font-semibold text-ink"
          >
            Mobile Number
          </label>
          <input
            id="sr-phone"
            type="tel"
            placeholder="01XXXXXXXXX"
            {...register("phone")}
            className={`w-full rounded-xl border bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:ring-2 ${
              errors.phone
                ? "border-secondary focus:border-secondary focus:ring-secondary/20"
                : "border-ink/10 focus:border-primary focus:ring-primary/20"
            }`}
          />
          {errors.phone && (
            <p className="mt-1.5 text-xs font-medium text-secondary">
              {errors.phone.message}
            </p>
          )}
        </div>

        <div>
          <label
            htmlFor="sr-email"
            className="mb-1.5 block text-sm font-semibold text-ink"
          >
            Email
          </label>
          <input
            id="sr-email"
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
      </div>

      <div>
        <label
          htmlFor="sr-service"
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          Which service do you need?
        </label>
        <input
          id="sr-service"
          type="text"
          {...register("service")}
          readOnly
          className="w-full rounded-xl border border-ink/10 bg-mist px-4 py-3 text-sm text-ink-soft outline-none"
        />
      </div>

      <div>
        <label
          htmlFor="sr-description"
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          Problem Description
        </label>
        <textarea
          id="sr-description"
          rows={4}
          placeholder="Describe your problem or what you need help with..."
          {...register("description")}
          className={`w-full resize-none rounded-xl border bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:ring-2 ${
            errors.description
              ? "border-secondary focus:border-secondary focus:ring-secondary/20"
              : "border-ink/10 focus:border-primary focus:ring-primary/20"
          }`}
        />
        {errors.description && (
          <p className="mt-1.5 text-xs font-medium text-secondary">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="sr-links"
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          Links / Additional Info{" "}
          <span className="font-normal text-ink-soft">(Optional)</span>
        </label>
        <input
          id="sr-links"
          type="text"
          placeholder="https://... or any relevant info"
          {...register("links")}
          className="w-full rounded-xl border border-ink/10 bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors placeholder:text-ink-soft/60 focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
      </div>

      <div>
        <label
          htmlFor="sr-contact"
          className="mb-1.5 block text-sm font-semibold text-ink"
        >
          Preferred Contact Method
        </label>
        <select
          id="sr-contact"
          {...register("contactMethod")}
          defaultValue=""
          className={`w-full rounded-xl border bg-cream px-4 py-3 text-sm text-ink outline-none transition-colors focus:ring-2 ${
            errors.contactMethod
              ? "border-secondary focus:border-secondary focus:ring-secondary/20"
              : "border-ink/10 focus:border-primary focus:ring-primary/20"
          }`}
        >
          <option value="" disabled>
            Select preferred method
          </option>
          <option value="Phone Call">Phone Call</option>
          <option value="WhatsApp">WhatsApp</option>
          <option value="Email">Email</option>
          <option value="Facebook Messenger">Facebook Messenger</option>
        </select>
        {errors.contactMethod && (
          <p className="mt-1.5 text-xs font-medium text-secondary">
            {errors.contactMethod.message}
          </p>
        )}
      </div>

      <p className="text-xs text-ink-soft">
        Service Charge: আলোচনা সাপেক্ষে
      </p>

      <div className="flex flex-col items-start gap-4 pt-2 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          onClick={onClose}
          className="cursor-pointer rounded-full border border-ink/15 px-6 py-3 text-sm font-semibold text-ink-soft transition-colors hover:bg-ink/5"
        >
          Cancel
        </button>
        <Hoverable className="w-full sm:w-auto">
          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full bg-gradient-admin px-8 py-3.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {isSubmitting ? "Submitting..." : "Submit Request"}
            {!isSubmitting && <span aria-hidden>&rarr;</span>}
          </button>
        </Hoverable>
      </div>
    </form>
  );
}
