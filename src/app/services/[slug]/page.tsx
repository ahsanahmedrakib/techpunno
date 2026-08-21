import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServiceSingle from "@/features/services/components/ServiceSingle";
import { services, type Service } from "@/features/services/data/services";

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
    title: `${service.title} — TechPunno`,
    description: service.description,
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
