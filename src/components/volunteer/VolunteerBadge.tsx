"use client";

import Container from "@/components/common/Container";
import { safeImage } from "@/lib/imageUrl";
import { formatDate } from "@/lib/utils";
import {
  ArrowLeft,
  BadgeCheck,
  BookOpenCheck,
  Calendar,
  GraduationCap,
  HeartHandshake,
  ShieldCheck,
  UserX,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { QRCodeCanvas } from "qrcode.react";

export default function VolunteerBadge({
  volunteer,
  volunteerUrl,
}: {
  volunteer: Record<string, unknown>;
  volunteerUrl: string;
}) {
  const name = String(volunteer.fullName ?? "TechPunno Member");
  const id = String(volunteer.volunteerId ?? volunteer.id ?? "");
  const membershipType = String(volunteer.membershipType ?? "Volunteer");
  const isAmbassador = membershipType === "Ambassador";
  const image = safeImage(String(volunteer.image ?? ""));

  return (
    <Container className="py-16 lg:py-24">
      <div>
        <Link
          href="/volunteers"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          <ArrowLeft size={15} />
          Back to Volunteers
        </Link>

        <div className="mt-8 overflow-hidden rounded-3xl border-2 border-primary/30 bg-white shadow-2xl shadow-primary/10">
          <div className="relative bg-linear-to-br from-[#1a3a68] via-primary to-primary-dark px-8 py-10 text-center sm:px-12">
            <div className="pointer-events-none absolute -top-20 -right-20 h-64 w-64 rounded-full bg-white/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-24 -left-16 h-64 w-64 rounded-full bg-secondary/20 blur-3xl" />

            <div className="relative">
              <div className="relative mx-auto h-28 w-28 overflow-hidden rounded-full border-4 border-white/30 bg-white shadow-xl shadow-black/20">
                {image ? (
                  <Image
                    src={image}
                    alt={name}
                    fill
                    sizes="112px"
                    className="object-cover"
                  />
                ) : (
                  <div className="grid h-full w-full place-items-center bg-linear-to-br from-primary to-primary-dark text-4xl font-extrabold text-white">
                    {name.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              <h1 className="mt-5 text-3xl font-extrabold text-white sm:text-4xl">
                {name}
              </h1>

              <div className="mt-3 flex flex-wrap items-center justify-center gap-2">
                <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                  {isAmbassador ? (
                    <ShieldCheck className="h-4 w-4 text-secondary-light" />
                  ) : (
                    <HeartHandshake className="h-4 w-4 text-secondary-light" />
                  )}
                  {membershipType}
                </span>
                {volunteer.status === "approved" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                    <BadgeCheck className="h-4 w-4" />
                    Verified
                  </span>
                )}
                {volunteer.status === "resigned" && (
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-500/80 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                    <UserX className="h-4 w-4" />
                    Resigned
                  </span>
                )}
              </div>

              <p className="mt-5 inline-flex items-center gap-2 rounded-2xl border-2 border-white/25 bg-black/20 px-5 py-2.5 font-mono text-sm font-bold tracking-widest text-white backdrop-blur-sm sm:text-base">
                {id || "TP-••-••"}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-8 p-8 sm:p-10 lg:grid-cols-[1fr_auto]">
            <div className="space-y-6">
              <div>
                <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-ink uppercase">
                  <Calendar className="h-4 w-4 text-primary" />
                  Membership
                </h2>
                <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-ink-soft/70">
                      Joining Date
                    </dt>
                    <dd className="text-sm font-semibold text-ink">
                      {volunteer.joiningDate
                        ? formatDate(String(volunteer.joiningDate))
                        : "—"}
                    </dd>
                  </div>
                  {volunteer.resignedDate ? (
                    <div>
                      <dt className="text-xs font-medium text-ink-soft/70">
                        Resigned Date
                      </dt>
                      <dd className="text-sm font-semibold text-ink">
                        {formatDate(String(volunteer.resignedDate))}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              <div>
                <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-ink uppercase">
                  <BookOpenCheck className="h-4 w-4 text-primary" />
                  Education & Work
                </h2>
                <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-ink-soft/70">
                      Educational Institute
                    </dt>
                    <dd className="text-sm font-semibold text-ink">
                      {String(volunteer.educationalInstitute ?? "—")}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-xs font-medium text-ink-soft/70">
                      Highest Education Level
                    </dt>
                    <dd className="text-sm font-semibold text-ink">
                      {String(volunteer.educationLevel ?? "—")}
                    </dd>
                  </div>
                  {volunteer.company ? (
                    <div>
                      <dt className="text-xs font-medium text-ink-soft/70">
                        Company
                      </dt>
                      <dd className="text-sm font-semibold text-ink">
                        {String(volunteer.company)}
                      </dd>
                    </div>
                  ) : null}
                  {volunteer.department ? (
                    <div>
                      <dt className="text-xs font-medium text-ink-soft/70">
                        Department
                      </dt>
                      <dd className="text-sm font-semibold text-ink">
                        {String(volunteer.department)}
                      </dd>
                    </div>
                  ) : null}
                  {volunteer.designation ? (
                    <div>
                      <dt className="text-xs font-medium text-ink-soft/70">
                        Designation
                      </dt>
                      <dd className="text-sm font-semibold text-ink">
                        {String(volunteer.designation)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div>

              {/* <div>
                <h2 className="flex items-center gap-2 text-sm font-bold tracking-wider text-ink uppercase">
                  <Phone className="h-4 w-4 text-primary" />
                  Contact
                </h2>
                <dl className="mt-4 grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
                  <div>
                    <dt className="text-xs font-medium text-ink-soft/70">
                      Mobile
                    </dt>
                    <dd className="text-sm font-semibold text-ink">
                      {String(volunteer.mobile ?? "—")}
                    </dd>
                  </div>
                  {volunteer.email ? (
                    <div>
                      <dt className="text-xs font-medium text-ink-soft/70">
                        Email
                      </dt>
                      <dd className="text-sm font-semibold text-ink">
                        <a
                          href={`mailto:${String(volunteer.email)}`}
                          className="hover:text-primary"
                        >
                          <Mail className="mr-1 inline h-3.5 w-3.5" />
                          {String(volunteer.email)}
                        </a>
                      </dd>
                    </div>
                  ) : null}
                  {volunteer.whatsapp ? (
                    <div>
                      <dt className="text-xs font-medium text-ink-soft/70">
                        WhatsApp
                      </dt>
                      <dd className="text-sm font-semibold text-ink">
                        {String(volunteer.whatsapp)}
                      </dd>
                    </div>
                  ) : null}
                </dl>
              </div> */}
            </div>

            <div className="mx-auto flex w-full max-w-64 flex-col items-center rounded-3xl border-2 border-primary/30 bg-cream p-6 text-center lg:w-64">
              <h2 className="text-sm font-bold tracking-wider text-ink uppercase">
                <GraduationCap className="mr-1.5 inline h-4 w-4 text-primary" />
                Scan to Verify
              </h2>
              <div className="mt-4 rounded-2xl border-2 border-primary/30 bg-white p-4 shadow-sm">
                <QRCodeCanvas
                  value={volunteerUrl}
                  size={168}
                  level="M"
                  bgColor="#ffffff"
                  fgColor="#1a3a68"
                />
              </div>
              <p className="mt-4 break-all font-mono text-[10px] leading-relaxed text-ink-soft/70">
                {volunteerUrl}
              </p>
              <p className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-primary-lighter px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                <Calendar className="h-3 w-3" />
                {volunteer.joiningDate
                  ? `Joined ${formatDate(String(volunteer.joiningDate))}`
                  : "TechPunno Family"}
              </p>
            </div>
          </div>
        </div>
      </div>
    </Container>
  );
}

