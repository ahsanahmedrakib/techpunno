import {
  defaultCertificateConfig,
  type CertificateConfig,
} from "@/features/certificates/data/certificate";
import { getCollection } from "@/lib/db";

export async function getCertificateConfig(): Promise<CertificateConfig> {
  try {
    const coll = await getCollection("certificateconfig");
    const doc = await coll.findOne({});
    if (!doc) return defaultCertificateConfig;
    const rest: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(doc)) {
      if (key !== "_id") rest[key] = value;
    }
    return { ...defaultCertificateConfig, ...rest } as CertificateConfig;
  } catch {
    return defaultCertificateConfig;
  }
}
