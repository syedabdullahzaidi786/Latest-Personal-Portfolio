import dynamic from "next/dynamic";
import type { Metadata } from "next";

/* ─── Per-page metadata ─── */
const siteUrl = "https://syedabdullahzaidi.vercel.app";

export const metadata: Metadata = {
  title: "Blog & Articles",
  description:
    "Articles, writeups and deep-dives on Agentic AI, fullstack development, RAG pipelines, and modern software engineering by Syed Abdullah Zaidi.",
  keywords: [
    "Syed Abdullah Zaidi Blog",
    "AI Articles",
    "Fullstack Development Blog",
    "RAG Pipeline",
    "Next.js Articles",
    "Agentic AI Blog",
  ],
  alternates: {
    canonical: `${siteUrl}/blogs`,
  },
  openGraph: {
    title: "Blog & Articles — Syed Abdullah Zaidi",
    description:
      "Articles on Agentic AI, fullstack development, and modern software engineering.",
    url: `${siteUrl}/blogs`,
    siteName: "Syed Abdullah Zaidi",
    type: "website",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: "Syed Abdullah Zaidi — Blog & Articles",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Blog & Articles — Syed Abdullah Zaidi",
    description:
      "Articles on Agentic AI, fullstack development, and modern software engineering.",
    images: ["/opengraph-image.png"],
  },
};

const Navbar = dynamic(() =>
  import("@/components/ui/Navbar").then((m) => ({ default: m.Navbar }))
);
const Footer = dynamic(() =>
  import("@/components/ui/Footer").then((m) => ({ default: m.Footer }))
);
const BlogsClient = dynamic(() =>
  import("@/components/blogs/BlogsClient").then((m) => ({ default: m.BlogsClient }))
);

/* ─── JSON-LD for blogs listing page ─── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Blog",
  name: "Syed Abdullah Zaidi — Blog",
  url: `${siteUrl}/blogs`,
  description:
    "Articles on Agentic AI, fullstack development, RAG pipelines, and modern software engineering.",
  author: {
    "@type": "Person",
    name: "Syed Abdullah Zaidi",
    url: siteUrl,
  },
};

export default function BlogsPage() {
  return (
    <main className="relative min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="relative z-10">
        <Navbar />
        <BlogsClient />
        <Footer />
      </div>
    </main>
  );
}
