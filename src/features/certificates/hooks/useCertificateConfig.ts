"use client";

import {
  defaultCertificateConfig,
  type CertificateConfig,
} from "@/features/certificates/data/certificate";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useCertificateConfig(): {
  config: CertificateConfig;
  loading: boolean;
} {
  const { data } = useQuery<CertificateConfig | undefined>({
    queryKey: ["certificate-config"],
    queryFn: () =>
      api
        .list<Record<string, unknown>>("certificateconfig")
        .then((docs) => {
          const doc = docs[0];
          return doc ? (doc as unknown as CertificateConfig) : undefined;
        }),
  });
  return {
    config: data ?? defaultCertificateConfig,
    loading: data === undefined,
  };
}
