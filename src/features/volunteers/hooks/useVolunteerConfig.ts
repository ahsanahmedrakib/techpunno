"use client";

import type { VolunteersConfig } from "@/features/volunteers/data/volunteers";
import { defaultVolunteerConfig } from "@/features/volunteers/data/volunteers";
import { api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";

export function useVolunteerConfig() {
  return useQuery({
    queryKey: ["volunteer-config"],
    queryFn: async (): Promise<VolunteersConfig> => {
      try {
        const docs = await api.list<Record<string, unknown>>("volunteerconfig");
        return (
          (docs[0] as unknown as VolunteersConfig) ?? defaultVolunteerConfig
        );
      } catch {
        return defaultVolunteerConfig;
      }
    },
  });
}

