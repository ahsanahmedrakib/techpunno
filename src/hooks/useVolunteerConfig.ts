"use client";

import type { VolunteerConfig } from "@/data/volunteers";
import { defaultVolunteerConfig } from "@/data/volunteers";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useVolunteerConfig() {
  return useQuery({
    queryKey: ["volunteer-config"],
    queryFn: async (): Promise<VolunteerConfig> => {
      try {
        const docs = await api.list<Record<string, unknown>>("volunteerconfig");
        return (
          (docs[0] as unknown as VolunteerConfig) ?? defaultVolunteerConfig
        );
      } catch {
        return defaultVolunteerConfig;
      }
    },
  });
}

