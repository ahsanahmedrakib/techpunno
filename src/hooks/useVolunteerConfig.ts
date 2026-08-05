"use client";

import { useQuery } from "@tanstack/react-query";
import { defaultVolunteerConfig } from "@/data/volunteer";
import type { VolunteerConfig } from "@/data/volunteer";
import { api } from "@/lib/api";

export function useVolunteerConfig() {
  return useQuery({
    queryKey: ["volunteer-config"],
    queryFn: async (): Promise<VolunteerConfig> => {
      try {
        const docs = await api.list<Record<string, unknown>>("volunteerconfig");
        return (docs[0] as unknown as VolunteerConfig) ?? defaultVolunteerConfig;
      } catch {
        return defaultVolunteerConfig;
      }
    },
  });
}
