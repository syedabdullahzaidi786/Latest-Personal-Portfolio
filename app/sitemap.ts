import type { MetadataRoute } from "next";

const siteUrl = "https://latest-personal-portfolio-gamma.vercel.app";
const lastMod = new Date().toISOString();

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url:             siteUrl,
      lastModified:    lastMod,
      changeFrequency: "weekly",
      priority:        1.0,
    },
    {
      url:             `${siteUrl}/blogs`,
      lastModified:    lastMod,
      changeFrequency: "weekly",
      priority:        0.8,
    },
  ];
}
