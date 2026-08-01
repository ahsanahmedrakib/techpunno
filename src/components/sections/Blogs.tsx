"use client";

import SectionHeading from "@/components/SectionHeading";
import { blogPosts } from "@/data/blogs";
import { fadeUp, stagger } from "@/lib/motion";
import { motion } from "framer-motion";

export default function Blogs() {
  return (
    <section
      id="blogs"
      className="section-anchor bg-primary-lighter py-20 lg:py-28"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Blogs"
          title="Stories &"
          accent="Guides"
          description="Practical, easy-to-read articles that help everyone build safer digital habits."
        />

        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {blogPosts.map((post, index) => {
            const featured = index % 3 === 0;
            return (
              <motion.article
                key={post.id}
                variants={fadeUp}
                className={`group flex flex-col overflow-hidden rounded-3xl border border-ink/5 bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-primary/15 ${
                  featured ? "lg:col-span-1" : ""
                }`}
              >
                <div className="relative flex h-44 items-center justify-center overflow-hidden bg-linear-to-br from-primary via-primary-light to-secondary">
                  <span className="absolute -left-6 -top-6 h-24 w-24 rounded-full bg-white/10" />
                  <span className="absolute -bottom-8 -right-6 h-28 w-28 rounded-full bg-white/10" />
                  <span className="text-6xl drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                    {post.emoji}
                  </span>
                  <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary backdrop-blur">
                    {post.category}
                  </span>
                </div>

                <div className="flex flex-1 flex-col p-6">
                  <h3 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                    {post.excerpt}
                  </p>
                  <div className="mt-5 flex items-center justify-between border-t border-ink/5 pt-4 text-xs text-ink-soft">
                    <span className="inline-flex items-center gap-2 font-medium">
                      <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-lighter text-[10px] font-bold text-primary">
                        {post.author.charAt(0)}
                      </span>
                      {post.author}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      {post.readTime} · {post.date}
                    </span>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}

