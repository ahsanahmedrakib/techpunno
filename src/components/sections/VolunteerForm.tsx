"use client";

import Hoverable from "@/components/common/Hoverable";
import {
  declarationText,
  privacyText,
  volunteerInterestOptions,
  volunteerRules,
} from "@/data/volunteer";
import { useVolunteerConfig } from "@/hooks/useVolunteerConfig";
import { api } from "@/lib/api";
import { volunteerSchema, type VolunteerFormValues } from "@/lib/validation";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import {
  Camera,
  Check,
  ChevronLeft,
  ChevronRight,
  HeartHandshake,
  Loader2,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";

const steps = [
  { label: "Personal Info", bn: "ব্যক্তিগত তথ্য" },
  { label: "Education & Interest", bn: "শিক্ষা ও আগ্রহ" },
  { label: "Payment & Declaration", bn: "পেমেন্ট ও ঘোষণা" },
];

const stepFields: (keyof VolunteerFormValues)[][] = [
  [
    "fullName",
    "fatherName",
    "motherName",
    "dateOfBirth",
    "gender",
    "mobile",
    "email",
    "whatsapp",
    "guardianName",
    "guardianRelation",
    "guardianMobile",
    "image",
  ],
  [
    "institute",
    "department",
    "educationLevel",
    "interestAreas",
    "membershipType",
  ],
  ["registrationFee", "paidBy", "transactionId", "declaration"],
];

const genderOptions = ["Male", "Female", "Other"];
const levelOptions = ["School", "College", "University", "Other"];
const paymentOptions = ["bKash", "Nagad", "Cash"];

function fieldError(errors: object, name: string): string | undefined {
  const key = name as keyof typeof errors;
  const err = (errors as Record<string, { message?: string }>)[key];
  return err?.message;
}

export default function VolunteerForm() {
  const [step, setStep] = useState(0);
  const [submitted, setSubmitted] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const photoRef = useRef<HTMLInputElement>(null);

  const { data: config } = useVolunteerConfig();
  const fee = config?.registrationFee ?? "৳ 100";

  const {
    register,
    handleSubmit,
    trigger,
    setValue,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<VolunteerFormValues>({
    resolver: yupResolver(volunteerSchema),
    mode: "onTouched",
    defaultValues: {
      interestAreas: [],
      declaration: false,
      registrationFee: fee,
      gender: "",
      membershipType: "",
      paidBy: "",
    },
  });

  const watchGender = watch("gender");
  const watchMembershipType = watch("membershipType");
  const watchPaidBy = watch("paidBy");
  const watchEducationLevel = watch("educationLevel");
  const watchInterestAreas = watch("interestAreas") ?? [];
  const watchDeclaration = watch("declaration");

  const toggleInterest = (opt: string) => {
    const next = watchInterestAreas.includes(opt)
      ? watchInterestAreas.filter((i) => i !== opt)
      : [...watchInterestAreas, opt];
    setValue("interestAreas", next, { shouldValidate: true });
  };

  const handlePhoto = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => setPhotoPreview(ev.target?.result as string);
    reader.readAsDataURL(file);
    const fd = new FormData();
    fd.append("file", file);
    fd.append("dir", "volunteers");
    try {
      const res = await axios.post<{ path?: string }>("/api/upload", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      if (res.data.path) {
        setValue("image", res.data.path, { shouldValidate: true });
        toast.success("Photo uploaded successfully!");
      }
    } catch {
      toast.error("Photo upload failed. You can continue without a photo.");
    }
  };

  const scrollToTop = () => {
    const scroller = document.querySelector("[data-volunteer-scroll]");
    if (scroller) scroller.scrollTo({ top: 0, behavior: "smooth" });
    else window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goNext = async () => {
    const ok = await trigger(stepFields[step]);
    if (ok) {
      setStep((s) => Math.min(s + 1, steps.length - 1));
      scrollToTop();
    }
  };

  const goBack = () => {
    setStep((s) => Math.max(s - 1, 0));
    scrollToTop();
  };

  const onSubmit = async (values: VolunteerFormValues) => {
    try {
      await api.create("volunteers", {
        ...values,
        registrationFee: values.registrationFee || fee,
      });
      setSubmitted(true);
      scrollToTop();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Registration failed");
    }
  };

  const inputCls = (err?: string) =>
    `w-full rounded-xl border bg-white px-4 py-3 text-sm text-ink outline-none transition-all placeholder:text-ink-soft/50 focus:ring-2 ${
      err
        ? "border-secondary focus:border-secondary focus:ring-secondary/20"
        : "border-ink/10 focus:border-primary focus:ring-primary/20"
    }`;

  const radioCard = (active: boolean) =>
    `cursor-pointer flex flex-1 items-center justify-center gap-2 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
      active
        ? "border-primary bg-primary-lighter text-primary shadow-sm"
        : "border-ink/10 bg-white text-ink-soft hover:border-primary/40"
    }`;

  if (submitted) {
    return (
      <div className="mx-auto max-w-xl rounded-3xl border-2 border-primary/40 bg-white p-10 text-center shadow-2xl shadow-primary/10">
        <motion.div
          initial={{ scale: 0.6, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="mx-auto mb-5 grid h-20 w-20 place-items-center rounded-full bg-primary-lighter text-primary"
        >
          <Check className="h-10 w-10" />
        </motion.div>
        <h2 className="text-2xl font-bold text-ink">Registration Submitted!</h2>
        <p className="mt-3 text-sm leading-relaxed text-ink-soft">
          ধন্যবাদ! আপনার আবেদনটি জমা হয়েছে। আপনার তথ্য যাচাই ও পেমেন্ট নিশ্চিত
          হওয়ার পর আমাদের টিম আপনাকে যোগাযোগ করবে।
          <br />
          <span className="mt-2 block font-medium text-ink">
            Your application is currently under review.
          </span>
        </p>
        <p className="mt-4 rounded-xl bg-cream p-3 text-xs text-ink-soft">
          {privacyText}
        </p>
        <button
          onClick={() => {
            reset({ interestAreas: [], declaration: false });
            setSubmitted(false);
            setStep(0);
            setPhotoPreview(null);
          }}
          className="cursor-pointer mt-6 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark"
        >
          Register another member
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-6xl rounded-3xl border-2 border-primary/40 bg-cream p-6 shadow-2xl shadow-primary/10 sm:p-10"
    >
      {/* Step indicator */}
      <ol className="mb-10 grid grid-cols-3 gap-2">
        {steps.map((s, i) => (
          <li key={s.label} className="relative">
            {i < steps.length - 1 && (
              <span
                className={`absolute top-5 left-[calc(50%+1.25rem)] hidden h-0.5 w-[calc(100%-2.5rem)] sm:block ${
                  i < step ? "bg-primary" : "bg-ink/10"
                }`}
              />
            )}
            <div className="flex flex-col items-center gap-2 text-center">
              <span
                className={`grid h-10 w-10 place-items-center rounded-full border-2 text-sm font-bold transition-all ${
                  i < step
                    ? "border-primary bg-primary text-white"
                    : i === step
                      ? "border-primary bg-white text-primary shadow-md shadow-primary/20"
                      : "border-ink/15 bg-white text-ink-soft/50"
                }`}
              >
                {i < step ? <Check className="h-5 w-5" /> : i + 1}
              </span>
              <span className="hidden sm:block">
                <span
                  className={`block text-xs font-bold ${
                    i <= step ? "text-primary" : "text-ink-soft/60"
                  }`}
                >
                  {s.label}
                </span>
                <span className="block text-[10px] text-ink-soft/60">
                  {s.bn}
                </span>
              </span>
            </div>
          </li>
        ))}
      </ol>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -40 }}
            transition={{ duration: 0.3 }}
          >
            {step === 0 && (
              <div className="space-y-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-lighter text-primary">
                    ১
                  </span>
                  ব্যক্তিগত তথ্য (Personal Information)
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Full Name (পূর্ণ নাম){" "}
                      <span className="text-secondary">*</span>
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
                      Father&apos;s Name (পিতার নাম){" "}
                      <span className="text-secondary">*</span>
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
                      Mother&apos;s Name (মাতার নাম){" "}
                      <span className="text-secondary">*</span>
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
                      Date of Birth (জন্ম তারিখ){" "}
                      <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="date"
                      {...register("dateOfBirth")}
                      className={inputCls(fieldError(errors, "dateOfBirth"))}
                    />
                    {fieldError(errors, "dateOfBirth") && (
                      <p className="mt-1.5 text-xs font-medium text-secondary">
                        {fieldError(errors, "dateOfBirth")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Gender (লিঙ্গ) <span className="text-secondary">*</span>
                    </label>
                    <div className="flex gap-2">
                      {genderOptions.map((g) => (
                        <button
                          key={g}
                          type="button"
                          onClick={() =>
                            setValue("gender", g, { shouldValidate: true })
                          }
                          className={radioCard(watchGender === g)}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                    {fieldError(errors, "gender") && (
                      <p className="mt-1.5 text-xs font-medium text-secondary">
                        {fieldError(errors, "gender")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Mobile Number (মোবাইল নম্বর){" "}
                      <span className="text-secondary">*</span>
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
                      Email (ইমেইল){" "}
                      <span className="font-normal text-ink-soft">
                        (optional)
                      </span>
                    </label>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      {...register("email")}
                      className={inputCls(fieldError(errors, "email"))}
                    />
                    {fieldError(errors, "email") && (
                      <p className="mt-1.5 text-xs font-medium text-secondary">
                        {fieldError(errors, "email")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      WhatsApp Number (হোয়াটসঅ্যাপ নম্বর)
                    </label>
                    <input
                      type="tel"
                      placeholder="017XXXXXXXX"
                      {...register("whatsapp")}
                      className={inputCls()}
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Photo (ছবি){" "}
                      <span className="font-normal text-ink-soft">
                        (optional — shown on the public page after approval)
                      </span>
                    </label>
                    <input
                      ref={photoRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handlePhoto}
                    />
                    <div
                      onClick={() => photoRef.current?.click()}
                      className="group flex cursor-pointer items-center gap-4 rounded-xl border-2 border-dashed border-primary/40 bg-white p-4 transition-all hover:border-primary hover:bg-primary-lighter/30"
                    >
                      <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-full border-2 border-primary/30 bg-mist">
                        {photoPreview ? (
                          <Image
                            src={photoPreview}
                            alt=""
                            fill
                            sizes="64px"
                            className="object-cover"
                            unoptimized={photoPreview.startsWith("data:")}
                          />
                        ) : (
                          <div className="grid h-full w-full place-items-center text-ink-soft/30">
                            <Camera className="h-7 w-7" />
                          </div>
                        )}
                      </div>
                      <div className="text-sm">
                        <p className="font-semibold text-ink">
                          {photoPreview
                            ? "Click to change photo"
                            : "Upload your photo"}
                        </p>
                        <p className="text-xs text-ink-soft/70">
                          JPG / PNG, max 5MB
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="sm:col-span-2">
                    <div className="rounded-xl border border-primary/20 bg-primary-lighter/40 p-4">
                      <p className="mb-3 text-xs font-bold uppercase tracking-wider text-primary">
                        Guardian / Emergency Contact (১৮ বছরের নিচে বয়স হলে
                        অভিভাবকের স্বাক্ষর প্রয়োজন)
                      </p>
                      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                        <div>
                          <input
                            type="text"
                            placeholder="Guardian's Name"
                            {...register("guardianName")}
                            className={inputCls(
                              fieldError(errors, "guardianName"),
                            )}
                          />
                          {fieldError(errors, "guardianName") && (
                            <p className="mt-1.5 text-xs font-medium text-secondary">
                              {fieldError(errors, "guardianName")}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="text"
                            placeholder="Relation"
                            {...register("guardianRelation")}
                            className={inputCls(
                              fieldError(errors, "guardianRelation"),
                            )}
                          />
                          {fieldError(errors, "guardianRelation") && (
                            <p className="mt-1.5 text-xs font-medium text-secondary">
                              {fieldError(errors, "guardianRelation")}
                            </p>
                          )}
                        </div>
                        <div>
                          <input
                            type="tel"
                            placeholder="Guardian Mobile"
                            {...register("guardianMobile")}
                            className={inputCls(
                              fieldError(errors, "guardianMobile"),
                            )}
                          />
                          {fieldError(errors, "guardianMobile") && (
                            <p className="mt-1.5 text-xs font-medium text-secondary">
                              {fieldError(errors, "guardianMobile")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="space-y-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-lighter text-primary">
                    ২
                  </span>
                  শিক্ষাগত তথ্য ও আগ্রহ (Educational Information & Interest)
                </h3>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Institution Name (প্রতিষ্ঠানের নাম){" "}
                      <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. XYZ School & College"
                      {...register("institute")}
                      className={inputCls(fieldError(errors, "institute"))}
                    />
                    {fieldError(errors, "institute") && (
                      <p className="mt-1.5 text-xs font-medium text-secondary">
                        {fieldError(errors, "institute")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Department / Section (বিভাগ/শাখা)
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Science / Class 9"
                      {...register("department")}
                      className={inputCls()}
                    />
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Education Level (শিক্ষার স্তর){" "}
                      <span className="text-secondary">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      {levelOptions.map((lvl) => (
                        <button
                          key={lvl}
                          type="button"
                          onClick={() =>
                            setValue("educationLevel", lvl, {
                              shouldValidate: true,
                            })
                          }
                          className={radioCard(watchEducationLevel === lvl)}
                        >
                          {lvl}
                        </button>
                      ))}
                    </div>
                    {fieldError(errors, "educationLevel") && (
                      <p className="mt-1.5 text-xs font-medium text-secondary">
                        {fieldError(errors, "educationLevel")}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Interest Area (আগ্রহের ক্ষেত্র){" "}
                      <span className="text-secondary">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {volunteerInterestOptions.map((opt) => {
                        const active = watchInterestAreas.includes(opt);
                        return (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => toggleInterest(opt)}
                            className={`cursor-pointer flex items-center gap-2.5 rounded-xl border-2 px-4 py-3 text-sm font-semibold transition-all ${
                              active
                                ? "border-primary bg-primary-lighter text-primary"
                                : "border-ink/10 bg-white text-ink-soft hover:border-primary/40"
                            }`}
                          >
                            <span
                              className={`grid h-5 w-5 shrink-0 place-items-center rounded-md border-2 transition-all ${
                                active
                                  ? "border-primary bg-primary text-white"
                                  : "border-ink/20 bg-white"
                              }`}
                            >
                              {active && <Check className="h-3.5 w-3.5" />}
                            </span>
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {fieldError(errors, "interestAreas") && (
                      <p className="mt-1.5 text-xs font-medium text-secondary">
                        {fieldError(errors, "interestAreas")}
                      </p>
                    )}
                  </div>

                  <div className="sm:col-span-2">
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Membership Type (সদস্যপদ ধরন){" "}
                      <span className="text-secondary">*</span>
                    </label>
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      {[
                        {
                          key: "Ambassador",
                          icon: HeartHandshake,
                          desc: "Represent Tech Punno and lead awareness in your community.",
                        },
                        {
                          key: "Volunteer",
                          icon: ShieldCheck,
                          desc: "Join events and help build a safer digital society.",
                        },
                      ].map((opt) => {
                        const active = watchMembershipType === opt.key;
                        return (
                          <button
                            key={opt.key}
                            type="button"
                            onClick={() =>
                              setValue("membershipType", opt.key, {
                                shouldValidate: true,
                              })
                            }
                            className={`cursor-pointer rounded-2xl border-2 p-5 text-left transition-all ${
                              active
                                ? "border-primary bg-primary-lighter shadow-md shadow-primary/10"
                                : "border-ink/10 bg-white hover:border-primary/40"
                            }`}
                          >
                            <span
                              className={`grid h-10 w-10 place-items-center rounded-xl ${
                                active
                                  ? "bg-primary text-white"
                                  : "bg-mist text-primary"
                              }`}
                            >
                              <opt.icon className="h-5 w-5" />
                            </span>
                            <span className="mt-3 block text-base font-bold text-ink">
                              {opt.key}
                            </span>
                            <span className="mt-1 block text-xs leading-relaxed text-ink-soft">
                              {opt.desc}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                    {fieldError(errors, "membershipType") && (
                      <p className="mt-1.5 text-xs font-medium text-secondary">
                        {fieldError(errors, "membershipType")}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {step === 2 && (
              <div className="space-y-5">
                <h3 className="flex items-center gap-2 text-sm font-bold text-ink">
                  <span className="grid h-7 w-7 place-items-center rounded-lg bg-primary-lighter text-primary">
                    ৩
                  </span>
                  সদস্যপদ পেমেন্ট (Membership Payment)
                </h3>

                <div className="rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-sm">
                  <div className="grid grid-cols-1 items-center gap-6 sm:grid-cols-2">
                    <div className="flex items-center gap-4">
                      <span className="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-secondary-light text-secondary">
                        <Wallet className="h-7 w-7" />
                      </span>
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-ink-soft/60">
                          Registration Fee (রেজিস্ট্রেশন ফি)
                        </p>
                        <p className="mt-1 text-2xl font-extrabold text-ink">
                          {fee}
                        </p>
                      </div>
                    </div>

                    <div className="rounded-2xl border-2 border-secondary/30 bg-white p-4 text-center">
                      <p className="text-xs font-bold uppercase tracking-wider text-secondary">
                        Pay via bKash (বিকাশ)
                      </p>
                      {config?.bkashQr ? (
                        <div className="relative mx-auto mt-3 h-36 w-36 overflow-hidden rounded-xl border border-ink/10">
                          <Image
                            src={config.bkashQr}
                            alt="bKash QR code"
                            fill
                            sizes="144px"
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <p className="mt-3 text-sm font-semibold text-ink">
                          {config?.bkashNumber ?? "017XXXXXXXX"}
                        </p>
                      )}
                      <p className="mt-2 text-sm font-semibold text-ink">
                        {config?.bkashNumber ?? "017XXXXXXXX"}
                      </p>
                      <p className="mt-1 text-[11px] text-ink-soft/70">
                        Send the fee via bKash then enter the Transaction ID
                        below.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Paid By (পেমেন্ট মাধ্যম){" "}
                      <span className="text-secondary">*</span>
                    </label>
                    <div className="flex gap-2">
                      {paymentOptions.map((opt) => (
                        <button
                          key={opt}
                          type="button"
                          onClick={() =>
                            setValue("paidBy", opt, { shouldValidate: true })
                          }
                          className={radioCard(watchPaidBy === opt)}
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                    {fieldError(errors, "paidBy") && (
                      <p className="mt-1.5 text-xs font-medium text-secondary">
                        {fieldError(errors, "paidBy")}
                      </p>
                    )}
                  </div>
                  <div>
                    <label className="mb-1.5 block text-sm font-semibold text-ink">
                      Transaction ID <span className="text-secondary">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. 8P7Q2R3A"
                      {...register("transactionId")}
                      className={inputCls(fieldError(errors, "transactionId"))}
                    />
                    {fieldError(errors, "transactionId") && (
                      <p className="mt-1.5 text-xs font-medium text-secondary">
                        {fieldError(errors, "transactionId")}
                      </p>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl border border-primary/20 bg-primary-lighter/40 p-5">
                  <p className="mb-2 text-xs font-bold uppercase tracking-wider text-primary">
                    Rules & Regulations (নিয়ম ও নীতিমালা)
                  </p>
                  <ul className="space-y-1.5">
                    {volunteerRules.map((rule, i) => (
                      <li
                        key={i}
                        className="flex gap-2 text-[13px] leading-relaxed text-ink"
                      >
                        <span className="mt-0.5 text-primary">✦</span>
                        <span>{rule}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <label className="flex cursor-pointer items-start gap-3 rounded-2xl border-2 border-primary/30 bg-white p-5 transition-all hover:border-primary/60">
                  <span
                    className={`mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-lg border-2 transition-all ${
                      watchDeclaration
                        ? "border-primary bg-primary text-white"
                        : "border-ink/20 bg-white"
                    }`}
                    onClick={() =>
                      setValue("declaration", !watchDeclaration, {
                        shouldValidate: true,
                      })
                    }
                  >
                    {watchDeclaration && <Check className="h-4 w-4" />}
                  </span>
                  <span className="text-sm leading-relaxed text-ink">
                    {declarationText}
                  </span>
                </label>
                {fieldError(errors, "declaration") && (
                  <p className="mt-1 text-xs font-medium text-secondary">
                    {fieldError(errors, "declaration")}
                  </p>
                )}

                <div className="rounded-xl bg-cream p-4 text-xs text-ink-soft">
                  Terms of Data Privacy (তথ্য গোপনীয়তার শর্ত): {privacyText}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        <div className="mt-8 flex flex-col-reverse items-center gap-3 border-t-2 border-primary/20 pt-6 sm:flex-row sm:justify-between">
          {step > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full border-2 border-primary/30 px-6 py-3 text-sm font-semibold text-ink transition-all hover:bg-primary-lighter hover:border-primary/60 sm:w-auto"
            >
              <ChevronLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <span className="hidden sm:block" />
          )}

          {step < steps.length - 1 ? (
            <Hoverable className="w-full sm:w-auto">
              <button
                type="button"
                onClick={goNext}
                className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark sm:w-auto"
              >
                Continue <ChevronRight className="h-4 w-4" />
              </button>
            </Hoverable>
          ) : (
            <Hoverable className="w-full sm:w-auto">
              <button
                type="submit"
                disabled={isSubmitting}
                className="cursor-pointer inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-8 py-3 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:bg-primary-dark disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Submitting...
                  </>
                ) : (
                  <>
                    Submit Registration <Check className="h-4 w-4" />
                  </>
                )}
              </button>
            </Hoverable>
          )}
        </div>
      </form>
    </motion.div>
  );
}

