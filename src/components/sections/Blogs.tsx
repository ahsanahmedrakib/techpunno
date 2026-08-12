"use client";

import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import Reveal from "@/components/common/Reveal";
import SectionHeading from "@/components/common/SectionHeading";
import { SkeletonBlogCard } from "@/components/common/Skeleton";
import { blogPosts, type BlogPost } from "@/data/blogs";
import { useTable } from "@/lib/api";
import { firstImage } from "@/lib/imageUrl";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";

export default function Blogs() {
  const [posts, loading] = useTable<BlogPost>("blogs", blogPosts);
  return (
    <section
      id="blogs"
      className="section-anchor bg-primary-lighter py-20 lg:py-28"
    >
      <Container>
        <SectionHeading
          eyebrow="Blogs"
          title="Stories &"
          accent="Guides"
          description="Practical, easy-to-read articles that help everyone build safer digital habits."
        />

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {loading ? (
            <>
              <SkeletonBlogCard />
              <SkeletonBlogCard />
              <SkeletonBlogCard />
            </>
          ) : (
            posts?.map((post, index) => (
              <Reveal
                key={post.id}
                variant={index % 2 === 0 ? "fade-up" : "zoom"}
                delay={(index % 3) * 120}
                className="h-full"
              >
                <Link
                  href={`/blogs/${post.slug || post.id}`}
                  className="block h-full"
                >
                  <Hoverable className="group flex h-full flex-col overflow-hidden rounded-3xl border-2 border-primary/40 bg-white shadow-sm transition-all hover:-translate-y-1.5 hover:border-primary hover:shadow-2xl hover:shadow-primary/15">
                    <div className="relative h-44 shrink-0 overflow-hidden">
                      <Image
                        src={firstImage(post) || "/images/dummy.jpeg"}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-linear-to-t from-black/50 via-black/10 to-transparent" />
                      <span className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-[11px] font-bold uppercase tracking-wide text-primary backdrop-blur">
                        {post.category}
                      </span>
                    </div>

                    <div className="flex flex-1 flex-col p-6">
                      <h3 className="text-lg font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                        {post.title}
                      </h3>
                      <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-soft">
                        {post.summary}
                      </p>
                      <div className="mt-5 flex items-center justify-between border-t border-ink/5 pt-4 text-xs text-ink-soft">
                        <span className="inline-flex items-center gap-2 font-medium">
                          <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-lighter text-[10px] font-bold text-primary">
                            {post.author.charAt(0)}
                          </span>
                          {post.author}
                        </span>
                        <span className="inline-flex items-center gap-1.5">
                          {post.readTime} · {formatDate(post.date)}
                        </span>
                      </div>
                    </div>
                  </Hoverable>
                </Link>
              </Reveal>
            ))
          )}
        </div>
      </Container>
    </section>
  );
}

