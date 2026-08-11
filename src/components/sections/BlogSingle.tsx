import Image from "next/image";
import Link from "next/link";
import Container from "@/components/common/Container";
import Reveal from "@/components/common/Reveal";
import { blogPosts, type BlogPost } from "@/data/blogs";

export default function BlogSingle({ item }: { item: BlogPost }) {
  const { title, excerpt, category, author, readTime, date, image } = item;
  const related = blogPosts.filter((p) => p.slug !== item.slug).slice(0, 3);

  return (
    <Container className="py-16 lg:py-24">
      <article className="mx-auto max-w-3xl">
        <Reveal variant="fade-left">
          <Link
            href="/#blogs"
            className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
          >
            ← Back to Blogs
          </Link>
        </Reveal>

        <Reveal delay={80}>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-primary px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-white">
              {category}
            </span>
            <span className="text-sm font-medium text-ink-soft">
              {readTime} · {date}
            </span>
          </div>
        </Reveal>

        <Reveal delay={160}>
          <h1 className="mt-4 text-3xl font-bold leading-tight text-ink sm:text-4xl">
            {title}
          </h1>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-4 flex items-center gap-2 text-sm text-ink-soft">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-lighter text-xs font-bold text-primary">
              {author.charAt(0)}
            </span>
            <span className="font-medium text-ink">{author}</span>
          </div>
        </Reveal>

        {image && (
          <Reveal variant="zoom" scale={0.96} delay={240}>
            <div className="relative mt-8 aspect-video w-full overflow-hidden rounded-3xl shadow-2xl shadow-ink/20">
              <Image
                src={image}
                alt={title}
                fill
                sizes="(max-width: 768px) 100vw, 768px"
                className="object-cover"
                priority
              />
            </div>
          </Reveal>
        )}

        <Reveal delay={240}>
          <div
            className="prose prose-lg max-w-none text-ink-soft prose-headings:text-ink prose-a:text-primary prose-strong:text-ink"
            dangerouslySetInnerHTML={{ __html: excerpt }}
          />
        </Reveal>

        <Reveal delay={400}>
          <div className="mt-8 text-center">
            <Link
              href="/#blogs"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
            >
              Explore More Blogs
            </Link>
          </div>
        </Reveal>

        {related.length > 0 && (
          <Reveal delay={400}>
            <div className="mt-12">
              <h2 className="text-xl font-bold text-ink">Related posts</h2>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                {related.map((p) => (
                  <Link
                    key={p.id}
                    href={`/blogs/${p.slug || p.id}`}
                    className="block h-full"
                  >
                    <div className="group h-full rounded-2xl border border-ink/5 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
                      <span className="rounded-full bg-primary-lighter px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary">
                        {p.category}
                      </span>
                      <h3 className="mt-3 text-sm font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                        {p.title}
                      </h3>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </Reveal>
        )}
      </article>
    </Container>
  );
}
