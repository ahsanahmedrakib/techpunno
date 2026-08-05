import type { Metadata } from "next";
import { headers } from "next/headers";
import { notFound } from "next/navigation";
import Certificate from "@/components/common/Certificate";
import Footer from "@/components/common/Footer";
import Navbar from "@/components/common/Navbar";
import { getCertificateConfig } from "@/lib/certificate-config";
import { getCollection } from "@/lib/db";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ certificateId: string }> };

async function findCertificate(certificateId: string) {
  const coll = await getCollection("certificates");
  return coll.findOne({ certificateId });
}

async function resolveCertificateUrl(certificateId: string): Promise<string> {
  const headerList = await headers();
  const host =
    headerList.get("x-forwarded-host") ??
    headerList.get("host") ??
    "localhost:3000";
  const forwardedProto = headerList.get("x-forwarded-proto");
  const proto =
    forwardedProto?.split(",")[0] ||
    (host.startsWith("localhost") || host.startsWith("127.0.0.1")
      ? "http"
      : "https");
  return `${proto}://${host}/certificate/${certificateId}`;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { certificateId } = await params;
  const cert = await findCertificate(certificateId);
  if (!cert) {
    return {
      title: "Certificate Not Found — TechPunno",
    };
  }
  return {
    title: `${String(cert.name)}'s Certificate — TechPunno`,
    description: `Verified Cyber Quiz certificate issued to ${String(cert.name)} by TechPunno.`,
  };
}

export default async function CertificatePage({ params }: PageProps) {
  const { certificateId } = await params;
  const cert = await findCertificate(certificateId);

  if (!cert) {
    notFound();
  }

  const certificateUrl = await resolveCertificateUrl(certificateId);
  const config = await getCertificateConfig();

  return (
    <>
      <Navbar />
      <main className="flex-1 bg-gray-100">
        <Certificate
          name={String(cert.name ?? "")}
          percentage={Number(cert.percentage)}
          phone={String(cert.phone ?? "")}
          date={cert.date ? String(cert.date) : undefined}
          certificateId={String(cert.certificateId)}
          certificateUrl={certificateUrl}
          config={config}
        />
      </main>
      <Footer />
    </>
  );
}
