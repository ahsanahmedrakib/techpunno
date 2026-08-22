import { site } from "@/features/shared/data/site";
import { getCollection } from "@/lib/db";
import type { TableKey } from "@/lib/tables";
import type { MetadataRoute } from "next";

async function getTableSlugs(
  tableKey: TableKey,
  slugField: string,
): Promise<string[]> {
  try {
    const coll = await getCollection(tableKey);
    const docs = await coll
      .find(
        { deletedAt: { $exists: false } },
        { projection: { [slugField]: 1 } },
      )
      .toArray();
    return docs
      .map((d) => String((d as Record<string, unknown>)[slugField] ?? ""))
      .filter(Boolean);
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  const staticPages: MetadataRoute.Sitemap = [
    { url: site.url, lastModified: now, changeFrequency: "daily", priority: 1 },
    {
      url: `${site.url}/about`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${site.url}/services`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${site.url}/volunteers`,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 0.8,
    },
    {
      url: `${site.url}/quiz`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.7,
    },
  ];

  const serviceSlugs = await getTableSlugs("services", "slug");
  const courseSlugs = await getTableSlugs("courses", "slug");
  const blogSlugs = await getTableSlugs("blogs", "slug");
  const newsSlugs = await getTableSlugs("news", "slug");
  const eventSlugs = await getTableSlugs("events", "slug");

  const dynamicPages: MetadataRoute.Sitemap = [
    ...serviceSlugs.map((slug) => ({
      url: `${site.url}/services/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...courseSlugs.map((slug) => ({
      url: `${site.url}/courses/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })),
    ...blogSlugs.map((slug) => ({
      url: `${site.url}/blogs/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...newsSlugs.map((slug) => ({
      url: `${site.url}/news/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
    ...eventSlugs.map((slug) => ({
      url: `${site.url}/events/${slug}`,
      lastModified: now,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    })),
  ];

  return [...staticPages, ...dynamicPages];
}

