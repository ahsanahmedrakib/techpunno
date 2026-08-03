"use client";

import { motion } from "framer-motion";
import { fadeUp } from "@/lib/motion";

type SectionHeadingProps = {
  eyebrow: string;
  title: string;
  accent?: string;
  description?: string;
  align?: "center" | "left";
};

export default function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
  align = "center",
}: SectionHeadingProps) {
  const centered = align === "center";

  return (
    <motion.div
      variants={fadeUp}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      className={`mb-12 max-w-2xl ${centered ? "mx-auto text-center" : ""}`}
    >
      <span
        className={`inline-flex items-center gap-2 rounded-full bg-primary-lighter px-4 py-1.5 text-xs font-semibold uppercase tracking-widest text-primary`}
      >
        {eyebrow}
      </span>
      <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight text-ink sm:text-4xl lg:text-[2.75rem]">
        {title} {accent && <span className="text-gradient">{accent}</span>}
      </h2>
      {description && (
        <p className="mt-4 text-base leading-relaxed text-ink-soft sm:text-lg">
          {description}
        </p>
      )}
    </motion.div>
  );
}
