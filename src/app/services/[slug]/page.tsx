import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceSingle from "@/features/services/components/ServiceSingle";
import { services, type Service } from "@/features/services/data/services";
import { site } from "@/features/shared/data/site";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}

function findService(slug: string): Service | null {
  return services.find((s) => s.slug === slug) ?? null;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) return { title: "Service — TechPunno" };
  return {
    title: service.title,
    description: service.description,
    openGraph: {
      title: `${service.title} | ${site.name}`,
      description: service.description,
      url: `${site.url}/services/${slug}`,
      images: [{ url: site.ogImage, width: 1200, height: 630 }],
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: `${service.title} | ${site.name}`,
      description: service.description,
      images: [site.ogImage],
    },
    alternates: {
      canonical: `${site.url}/services/${slug}`,
    },
  };
}

export default async function ServicePage({ params }: Props) {
  const { slug } = await params;
  const service = findService(slug);
  if (!service) notFound();

  return (
    <main className="flex-1">
      <ServiceSingle service={service} />
    </main>
  );
}
