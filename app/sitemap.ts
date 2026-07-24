import type { MetadataRoute } from "next";
import { Pool } from "@neondatabase/serverless";

const siteUrl = "https://latest-personal-portfolio-gamma.vercel.app";

async function getIds(table: string): Promise<number[]> {
  const connectionString = process.env.DATABASE_URL?.trim();
  if (!connectionString) return [];
  const pool = new Pool({ connectionString });
  try {
    const { rows } = await pool.query(`SELECT id FROM "${table}" ORDER BY id ASC`);
    return rows.map((r: { id: number }) => r.id);
  } catch {
    return [];
  } finally {
    await pool.end();
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [projectIds, achievementIds] = await Promise.all([
    getIds("Project"),
    getIds("Achievement"),
  ]);

  const now = new Date().toISOString();

  return [
    /* Static pages */
    { url: siteUrl,               lastModified: now, changeFrequency: "weekly",  priority: 1.0 },
    { url: `${siteUrl}/blogs`,    lastModified: now, changeFrequency: "weekly",  priority: 0.8 },

    /* Dynamic project pages */
    ...projectIds.map((id) => ({
      url:             `${siteUrl}/projects/${id}`,
      lastModified:    now,
      changeFrequency: "monthly" as const,
      priority:        0.7,
    })),

    /* Dynamic achievement pages */
    ...achievementIds.map((id) => ({
      url:             `${siteUrl}/achievements/${id}`,
      lastModified:    now,
      changeFrequency: "monthly" as const,
      priority:        0.6,
    })),
  ];
}
