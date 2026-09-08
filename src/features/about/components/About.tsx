"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { site } from "@/features/shared/data/site";
import {
  BookOpen,
  Globe,
  GraduationCap,
  Handshake,
  Heart,
  Laptop,
  Lightbulb,
  LineChart,
  Lock,
  Newspaper,
  Shield,
  ShieldCheck,
  Sparkles,
  Target,
  Trophy,
  Users,
  Zap,
} from "lucide-react";
import Link from "next/link";

const whyJoinItems = [
  {
    icon: ShieldCheck,
    text: "সাইবার নিরাপত্তা ও অনলাইন সচেতনতা বিষয়ক সেমিনার ও কর্মশালায় অংশগ্রহণের সুযোগ",
  },
  {
    icon: Laptop,
    text: "প্রোগ্রামিং, AI এবং ডিজিটাল দক্ষতা বিষয়ক কার্যক্রমে অংশগ্রহণের সুযোগ",
  },
  {
    icon: Trophy,
    text: "নেতৃত্ব, সংগঠন ও দলগত কাজের দক্ষতা উন্নয়নের সুযোগ",
  },
  {
    icon: Heart,
    text: "স্বেচ্ছাসেবী ও সামাজিক কার্যক্রমে অংশগ্রহণের সুযোগ",
  },
  {
    icon: Sparkles,
    text: "সার্টিফিকেট ও স্বীকৃতি অর্জনের সুযোগ",
  },
  {
    icon: BookOpen,
    text: "নতুন নতুন শিক্ষা, প্রোগ্রামিং ও ক্যারিয়ারনির্দেশিকা নির্দেশনা",
  },
  {
    icon: Globe,
    text: "ইন্টারনেট, শিক্ষামূলক ও দক্ষ তরুণদের একটি কমিউনিটির অংশ হওয়ার সুযোগ",
  },
];

const roles = [
  "Volunteer Team Member",
  "Campus Representative",
  "Event Coordinator",
  "Team Leader",
  "Awareness Ambassador",
];

const visionItems = [
  { icon: Shield, text: "মানবিক অধিকার ও গণতন্ত্র" },
  { icon: Target, text: "ডিজিটাল সচেতনতা প্রচার" },
  { icon: Zap, text: "দক্ষতা ও কর্মসংস্থান" },
  { icon: Lock, text: "OTP ও পাসওয়ার্ড নিরাপত্তা" },
  { icon: Users, text: "মানবিক যোগাযোগের মাধ্যমে অধিকার" },
  { icon: LineChart, text: "ব্যক্তিগত তথ্য সুরক্ষা" },
  { icon: Newspaper, text: "ডিজিটাল কারিগরি" },
  { icon: Globe, text: "মানবিক উন্নয়ন ও গণতন্ত্র" },
];

const missionItems = [
  "শিক্ষার্থী, শিক্ষক ও অভিভাবকদের গাছে মানবিক অধিকার বিষয়ে সচেতনতা সৃষ্টির জন্য",
  "ডিজিটাল মাধ্যমে অধিকার ব্যবহার সম্পর্কে জ্ঞান প্রদান",
  "শিক্ষাকার্যক্রমের দক্ষতা উন্নয়ন",
  "সচেতনতা সম্পর্কে গুরুত্বপূর্ণ তথ্য প্রদান",
  "ডিজিটাল অধিকার সম্পর্কে সার্টিফিকেট প্রদান",
];

const achievements = [
  {
    title:
      "গোপালগঞ্জ জেলার বিভিন্ন শিক্ষা প্রতিষ্ঠান ও মানবিক কর্মকাণ্ডে সচেতনতা বিষয়ক একাধিক কার্যক্রম",
    detail:
      "চাঁদপুরের মির্জাপুর উপজেলা থেকে TechPunno আয়োজিত মানবিক সচেতনতা মূলক ২০২৫ এর কিছু ছবি।",
  },
  {
    title: "চাঁদপুর মির্জাপুর উপজেলা থেকে আয়োজিত মানবিক",
    detail: "অধিকার ও ডিজিটাল-২০২৫ কর্মশালা",
  },
  {
    title: "ইসলামিক বিশ্ববিদ্যালয় গোপালগঞ্জ থেকে আয়োজিত ছাত্রদের জন্য",
    detail: "ডিজিটাল মাধ্যমে-২০২৫ এর মূলক ছবি।",
  },
];

const curriculumTopics = [
  "মানবিক অধিকার ও গণতন্ত্র",
  "সাইবার অপরাধ প্রতিরোধ",
  "ব্যাংকিং ও অনলাইন লেনদেন",
  "OTP ও পাসওয়ার্ড নিরাপত্তা",
  "মানবিক যোগাযোগের মাধ্যমে অধিকার",
  "ব্যক্তিগত তথ্য সুরক্ষা",
  "ডিজিটাল কারিগরি",
  "মানবিক উন্নয়ন ও গণতন্ত্র",
];

const curriculumActivities = [
  {
    icon: Shield,
    text: "মানবিক সচেতনতা ও গণতন্ত্র কার্যক্রম",
  },
  {
    icon: Lock,
    text: "ব্যাংকিং, ডিজিটাল পেমেন্ট ও অনলাইন লেনদেন সম্পর্কে জ্ঞান প্রদান",
  },
  {
    icon: Globe,
    text: "কর্মশালা মানবিক কর্ম ও ফোরামের জন্য ডিজিটাল প্রযুক্তি",
  },
  {
    icon: Laptop,
    text: "তরুণদের ডিজিটাল পেমেন্ট ব্যবহারের জ্ঞান",
  },
  {
    icon: Newspaper,
    text: "মানবিক সচেতনতার মাধ্যমে মূল্যবোধ সৃষ্টি",
  },
];

const impacts = [
  "ডিজিটাল সুরক্ষায় সচেতন হয়েছে।",
  "মানবিক অধিকার থেকে আত্মবিশ্বাস বৃদ্ধি পায়।",
  "সচেতনতার মাধ্যমে অর্জন করে।",
  "জ্ঞান ও কার্যক্রমের মাধ্যমে বিকশিত হয়।",
  "স্বেচ্ছাসেবী দলে অংশ নেওয়ার সুযোগ।",
];

export default function About() {
  return (
    <>
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-linear-to-br from-ink via-[#0a3322] to-primary-dark pt-24 pb-20 lg:pt-32 lg:pb-28">
        <div
          aria-hidden
          className="absolute inset-0 bg-[url('/images/about-hero.svg')] bg-cover bg-center"
        />
        <div className="pointer-events-none absolute inset-0 bg-linear-to-br from-ink/80 via-[#0a3322]/70 to-primary-dark/80" />
        <div className="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <Container>
          <Reveal variant="fade-up" distance={40} className="text-center">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-white/90 backdrop-blur-sm">
              About Us
            </span>
            <h1 className="mt-5 text-4xl font-extrabold uppercase leading-[1.1] tracking-tight text-white sm:text-5xl xl:text-6xl">
              ABOUT{" "}
              <span className="bg-linear-to-r from-primary-light via-primary to-primary-dark bg-clip-text text-transparent">
                TECH PUNNO
              </span>
            </h1>
            <p className="mx-auto mt-6 max-w-2xl text-base leading-relaxed text-white/70 sm:text-lg">
              SECURE · LEAD · GROW
            </p>
          </Reveal>
        </Container>
      </section>

      {/* About Tech Punno */}
      <section className="section-anchor py-20 lg:py-28">
        <Container>
          <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
            <Reveal variant="fade-left">
              <SectionHeading
                eyebrow="About"
                title="About Tech"
                accent="Punno"
                align="left"
              />
              <p className="mt-6 text-base leading-relaxed text-ink-soft sm:text-lg">
                Tech Punno একটি প্রযুক্তি ও সাইবার সচেতনতামূলক যুব প্ল্যাটফর্ম,
                যা শিক্ষার্থীদের প্রযুক্তি জ্ঞান, ডিজিটাল নিরাপত্তা, অনলাইনের
                দক্ষতা এবং সামাজিক উদ্ভাবনী কার্যক্রমে সহায়তা করে। আমাদের
                লক্ষ্য হচ্ছে তরুণদের জন্য এমন একটি ইন্টারনেট প্ল্যাটফর্ম তৈরি
                করা, যেখানে তারা শিখতে, অনলাইনে থাকতে এবং সমাজে ইন্টারনেট
                প্রতিবন্ধী ভূমিকা রাখতে পারে।
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Hoverable>
                  <Link
                    href="/volunteers"
                    className="inline-flex rounded-full bg-gradient-admin px-7 py-3.5 text-sm font-semibold text-white shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-primary/40"
                  >
                    Join Us
                  </Link>
                </Hoverable>
                <Hoverable>
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex rounded-full border-2 border-ink/10 px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
                  >
                    Follow on Facebook
                  </a>
                </Hoverable>
              </div>
            </Reveal>

            <Reveal variant="fade-right" delay={200}>
              <div className="relative">
                <div className="absolute -inset-4 rounded-3xl bg-gradient-admin opacity-10 blur-2xl" />
                <div className="relative rounded-3xl border-2 border-primary/20 bg-white p-8 shadow-xl">
                  <div className="flex items-center gap-4">
                    <div className="grid h-16 w-16 place-items-center rounded-2xl bg-gradient-admin text-3xl font-extrabold text-white shadow-lg">
                      TP
                    </div>
                    <div>
                      <h3 className="text-xl font-bold uppercase text-ink">
                        Tech Punno
                      </h3>
                      <p className="text-sm font-semibold text-primary">
                        SECURE · LEAD · GROW
                      </p>
                    </div>
                  </div>
                  <div className="mt-6 space-y-3">
                    {curriculumTopics.slice(0, 4).map((topic) => (
                      <div key={topic} className="flex items-center gap-3">
                        <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </span>
                        <span className="text-sm font-medium text-ink-soft">
                          {topic}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Why Join Tech Punno */}
      <section className="section-anchor bg-gradient-admin-subtle py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Opportunities"
            title="Why Join Tech"
            accent="Punno?"
          />
          <div className="mx-auto mt-4 max-w-3xl">
            <Reveal variant="fade-up" delay={100}>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {whyJoinItems.map((item, i) => (
                  <Reveal key={i} variant="fade-up" delay={i * 80}>
                    <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                      <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <p className="text-sm font-medium leading-relaxed text-ink-soft">
                        {item.text}
                      </p>
                    </div>
                  </Reveal>
                ))}
              </div>
            </Reveal>

            <Reveal variant="fade-up" delay={300}>
              <div className="mt-8 rounded-2xl border-2 border-primary/20 bg-white p-6 shadow-sm">
                <h3 className="text-lg font-bold uppercase text-ink">
                  সঠিক সেবার জন্য—
                </h3>
                <div className="mt-4 flex flex-wrap gap-3">
                  {roles.map((role) => (
                    <span
                      key={role}
                      className="rounded-full bg-gradient-admin px-4 py-2 text-xs font-semibold text-white shadow-sm"
                    >
                      {role}
                    </span>
                  ))}
                </div>
                <p className="mt-4 text-sm text-ink-soft">
                  স্বেচ্ছাসেবী কাজ করার সুযোগ রয়েছে।
                </p>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Vision & Mission */}
      <section className="section-anchor py-20 lg:py-28">
        <Container>
          <div className="grid gap-12 lg:grid-cols-2">
            {/* Vision */}
            <Reveal variant="fade-left">
              <div className="h-full rounded-3xl border-2 border-primary/20 bg-white p-8 shadow-sm">
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-admin text-white shadow-lg">
                  <Lightbulb className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold uppercase text-ink">
                  Tech Punno&apos;s Vision
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  TechPunno মিশনঃ শিক্ষার্থীদের প্রযুক্তির সঠিক ব্যবহার, সাইবার
                  নিরাপত্তা সম্পর্কে সচেতনতা এবং অনলাইনের দক্ষতা একটি
                  শিক্ষার্থীর ভবিষ্যৎ গঠনে গুরুত্বপূর্ণ ভূমিকা পালন করে।
                </p>
                <div className="mt-6 space-y-3">
                  {visionItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-ink-soft">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>

            {/* Mission */}
            <Reveal variant="fade-right" delay={150}>
              <div className="h-full rounded-3xl border-2 border-primary/20 bg-white p-8 shadow-sm">
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-admin text-white shadow-lg">
                  <Target className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold uppercase text-ink">
                  Tech Punno&apos;s Mission
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-ink-soft">
                  TechPunno প্রযুক্তির সঠিক ব্যবহার, সাইবার নিরাপত্তা সম্পর্কে
                  সচেতনতা এবং অনলাইনের দক্ষতা একটি শিক্ষার্থীর ভবিষ্যৎ গঠনে
                  গুরুত্বপূর্ণ ভূমিকা পালন করে।
                </p>
                <div className="mt-6 space-y-3">
                  {missionItems.map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <span className="mt-1 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10">
                        <span className="h-2 w-2 rounded-full bg-primary" />
                      </span>
                      <span className="text-sm font-medium text-ink-soft">
                        {item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Our Activities & Curriculum */}
      <section className="section-anchor bg-gradient-admin-subtle py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Programs"
            title="Our Activities &"
            accent="Curriculum"
          />
          <div className="mx-auto mt-4 max-w-3xl">
            <Reveal variant="fade-up">
              <div className="rounded-3xl border-2 border-primary/20 bg-white p-8 shadow-sm">
                <h3 className="text-lg font-bold uppercase text-ink">
                  পাঠ্যক্রমের অন্তর্ভুক্ত বিষয়সমূহ
                </h3>
                <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  {curriculumActivities.map((item, i) => (
                    <div
                      key={i}
                      className="flex items-center gap-3 rounded-xl bg-primary-tint p-3"
                    >
                      <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-gradient-admin text-white">
                        <item.icon className="h-4 w-4" />
                      </span>
                      <span className="text-sm font-medium text-ink">
                        {item.text}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold uppercase text-ink">
                    অন্তর্ভুক্ত বিষয়সমূহ
                  </h3>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {curriculumTopics.map((topic) => (
                      <span
                        key={topic}
                        className="rounded-full border border-primary/20 bg-white px-3 py-1.5 text-xs font-semibold text-primary"
                      >
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold uppercase text-ink">
                    উদ্ধৃতিদর্শন কার্যক্রম
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">
                    TechPunno বিভিন্ন শিক্ষা প্রতিষ্ঠান ও মানবিক কর্মকাণ্ডে
                    সচেতনতা বিষয়ক একাধিক কার্যক্রম পরিচালনা করে।
                  </p>
                  <div className="mt-4 space-y-3">
                    {achievements.map((item, i) => (
                      <div
                        key={i}
                        className="rounded-xl border border-ink/5 bg-mist p-4"
                      >
                        <p className="text-sm font-semibold text-ink">
                          {item.title}
                        </p>
                        <p className="mt-1 text-xs text-ink-soft">
                          {item.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-lg font-bold uppercase text-ink">
                    পরিবারিক কার্যক্রম
                  </h3>
                  <p className="mt-2 text-sm text-ink-soft">
                    TechPunno-এর বিভিন্ন শিক্ষা প্রতিষ্ঠান ও মানবিক কর্মকাণ্ডে
                    সচেতনতা বিষয়ক একাধিক কার্যক্রম মাঝে মাঝে পরিচালনা করে।
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Message for Parents */}
      <section className="section-anchor py-20 lg:py-28">
        <Container>
          <div className="mx-auto max-w-3xl">
            <Reveal variant="fade-up">
              <div className="rounded-3xl border-2 border-primary/20 bg-white p-8 shadow-sm sm:p-10">
                <div className="mb-6 grid h-14 w-14 place-items-center rounded-2xl bg-gradient-admin text-white shadow-lg">
                  <Handshake className="h-7 w-7" />
                </div>
                <h3 className="text-xl font-bold uppercase text-ink">
                  Message for Parents
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-ink-soft sm:text-base">
                  বর্তমান সময়ে প্রযুক্তির সঠিক ব্যবহার, সাইবার নিরাপত্তা
                  সম্পর্কে সচেতনতা এবং অনলাইনের দক্ষতা একটি শিক্ষার্থীর ভবিষ্যৎ
                  গঠনে গুরুত্বপূর্ণ ভূমিকা পালন করে। Tech Punno শিক্ষার্থীদের
                  সুস্থ, নিরাপদ এবং ইন্টারনেট প্রযুক্তি ব্যবহারে উৎসাহিত করার
                  পাশাপাশি তাদের দক্ষতা ও আত্মবিশ্বাস বৃদ্ধি করার কাজ করে। আপনার
                  সন্তানের জ্ঞান, দক্ষতা ও সচেতনতা বৃদ্ধির এই যাত্রায় আপনার
                  সহযোগিতা ও উৎসাহ আমাদের জন্য অত্যন্ত মূল্যবান।
                </p>
                <div className="mt-6 rounded-xl bg-primary-tint p-4">
                  <p className="text-sm font-medium text-primary">
                    যুবকদের মধ্যে প্রযুক্তি ব্যবহারের প্রবণতা বৃদ্ধি পাচ্ছে, যার
                    ফলে প্রযুক্তি ব্যবহারের সুবিধা ও অসুবিধা উভয়ই বাড়ছে।
                    সাইবার প্রতারণা, ডেটা চুরি এবং অনলাইন নিরাপত্তা ঝুঁকি
                    সম্পর্কে সচেতন করতে বিভিন্ন সেমিনার ও কর্মশালা আয়োজন করা
                    হয়েছে।
                  </p>
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* Our Research & Recognition */}
      <section className="section-anchor bg-gradient-admin-subtle py-20 lg:py-28">
        <Container>
          <SectionHeading
            eyebrow="Impact"
            title="Our Research &"
            accent="Recognition"
          />
          <div className="mx-auto mt-4 max-w-3xl">
            <Reveal variant="fade-up">
              <p className="mb-8 text-center text-sm leading-relaxed text-ink-soft sm:text-base">
                TechPunno-র বিভিন্ন সার্টিফিকেশন ও প্রশিক্ষণ কার্যক্রম স্থানীয়
                ও জাতীয় পর্যায়ে স্বীকৃত, যা আমাদের কার্যক্রমের মান ও মানবিক
                প্রভাবের প্রমাণ।
              </p>
            </Reveal>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {impacts.map((item, i) => (
                <Reveal key={i} variant="fade-up" delay={i * 80}>
                  <div className="flex items-start gap-3 rounded-2xl bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md">
                    <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary/10 text-primary">
                      <GraduationCap className="h-3.5 w-3.5" />
                    </span>
                    <p className="text-sm font-medium text-ink-soft">{item}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}

