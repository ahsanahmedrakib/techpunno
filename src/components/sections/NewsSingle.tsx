import Container from "@/components/common/Container";
import Hoverable from "@/components/common/Hoverable";
import ImageSwiper from "@/components/common/ImageSwiper";
import Reveal from "@/components/common/Reveal";
import { newsItems, type NewsItem } from "@/data/news";
import { site } from "@/data/site";
import { singleImageList } from "@/lib/imageUrl";
import { formatDate, safeUrl } from "@/lib/utils";
import Link from "next/link";

const badgeStyles: Record<NewsItem["badge"], string> = {
  Hot: "bg-secondary text-white",
  Update: "bg-primary-lighter text-primary",
  Announcement: "bg-mist text-ink-soft",
};

export default function NewsSingle({ item }: { item: NewsItem }) {
  const { title, content, date, badge, externalUrl } = item;
  const isStatic = newsItems.some((n) => n.id === item.id);
  const related = isStatic
    ? newsItems.filter((n) => n.slug !== item.slug).slice(0, 2)
    : [];
  const iframeSrc = safeUrl(externalUrl);

  return (
    <Container className="py-16 lg:py-24">
      <Reveal variant="fade-left">
        <Link
          href="/#news"
          className="inline-flex items-center gap-2 text-sm font-semibold text-primary transition-colors hover:text-primary-dark"
        >
          ← Back to News
        </Link>
      </Reveal>

      <Reveal delay={80}>
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <span
            className={`rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-widest ${badgeStyles[badge]}`}
          >
            {badge}
          </span>
          <span className="text-sm font-medium text-ink-soft">
            {formatDate(date)}
          </span>
        </div>
      </Reveal>

      <Reveal delay={160}>
        <h1 className="mt-4 text-3xl font-bold leading-tight text-ink sm:text-4xl">
          {title}
        </h1>
      </Reveal>

      {!iframeSrc && singleImageList(item).length > 0 && (
        <Reveal variant="zoom" scale={0.96} delay={240}>
          <div className="mt-8">
            <ImageSwiper images={singleImageList(item)} alt={title} />
          </div>
        </Reveal>
      )}

      {!iframeSrc && content.trim() && (
        <Reveal delay={240}>
          <div className="min-w-0 overflow-hidden rounded-2xl border-2 border-primary/30 bg-white p-6 shadow-sm sm:p-8">
            <div
              className="prose prose-lg max-w-none text-ink-soft prose-headings:text-ink prose-a:text-primary prose-strong:text-ink prose-img:rounded-2xl prose-video:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: content }}
            />
          </div>
        </Reveal>
      )}

      {iframeSrc && (
        <Reveal delay={240}>
          <div className="mt-8 overflow-hidden rounded-3xl border border-ink/10 bg-white shadow-2xl shadow-ink/20">
            <iframe
              src={iframeSrc}
              title={title}
              className="h-screen w-full"
              loading="lazy"
              allowFullScreen
              sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
            />
          </div>
        </Reveal>
      )}

      {!iframeSrc && (
        <>
          <Reveal delay={320}>
            <div className="mt-10 rounded-2xl bg-primary-lighter p-6 text-center sm:p-8">
              <p className="text-lg font-bold text-ink">
                Tech Punno এর সাথে থাকুন, নিরাপদ থাকুন।
              </p>
              <p className="mt-1 text-sm text-ink-soft">
                Follow us for the latest cyber awareness tips and updates.
              </p>
              <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                <Hoverable>
                  <a
                    href={site.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white shadow-lg shadow-primary/25 transition-all hover:-translate-y-0.5 hover:bg-primary-dark"
                  >
                    Follow {site.name}
                  </a>
                </Hoverable>
                <Hoverable>
                  <Link
                    href="/#news"
                    className="inline-flex items-center gap-2 rounded-full border-2 border-ink/10 px-6 py-2.5 text-sm font-semibold text-ink transition-colors hover:border-primary hover:text-primary"
                  >
                    More News
                  </Link>
                </Hoverable>
              </div>
            </div>
          </Reveal>

          {related.length > 0 && (
            <Reveal delay={400}>
              <div className="mt-12">
                <h2 className="text-xl font-bold text-ink">Related news</h2>
                <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {related.map((n) => (
                    <Link
                      key={n.id}
                      href={`/news/${n.slug || n.id}`}
                      className="block h-full"
                    >
                      <Hoverable className="group h-full rounded-2xl border border-ink/5 bg-white p-5 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg">
                        <div className="flex items-center gap-2">
                          <span
                            className={`rounded-full px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest ${badgeStyles[n.badge]}`}
                          >
                            {n.badge}
                          </span>
                          <span className="text-xs font-medium text-ink-soft">
                            {formatDate(n.date)}
                          </span>
                        </div>
                        <h3 className="mt-3 text-sm font-bold leading-snug text-ink transition-colors group-hover:text-primary">
                          {n.title}
                        </h3>
                      </Hoverable>
                    </Link>
                  ))}
                </div>
              </div>
            </Reveal>
          )}
        </>
      )}
    </Container>
  );
}
