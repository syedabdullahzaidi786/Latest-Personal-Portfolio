import type { MetadataRoute } from "next";

const siteUrl = "https://syedabdullahzaidi.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    /* Homepage — highest priority, Google's main entry point for name search */
    {
      url:             siteUrl,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        1.0,
    },
    /* Blogs page — separate crawlable URL */
    {
      url:             `${siteUrl}/blogs`,
      lastModified:    new Date(),
      changeFrequency: "weekly",
      priority:        0.8,
    },
  ];
}
