import type { Metadata, Viewport } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import dynamic from "next/dynamic";
import { ScrollProgress } from "@/components/ui/ScrollProgress";

const CustomCursor = dynamic(
  () => import("@/components/ui/CustomCursor").then((m) => ({ default: m.CustomCursor })),
  { ssr: false }
);

/* ─── Site constants ─── */
const siteUrl   = "https://syedabdullahzaidi.vercel.app";
const siteName  = "Syed Abdullah Zaidi";
const title     = "Syed Abdullah Zaidi — Agentic AI & Fullstack Developer";
const description =
  "Agentic AI Developer & Fullstack Engineer specializing in autonomous AI systems, multi-agent workflows, RAG pipelines, and production-ready fullstack applications built with Next.js, FastAPI, and TypeScript.";
const keywords = [
  "Syed Abdullah Zaidi",
  "Agentic AI Developer",
  "Fullstack Developer",
  "AI Engineer",
  "Next.js Developer",
  "React Developer",
  "TypeScript",
  "FastAPI",
  "RAG Pipeline",
  "Multi-Agent AI",
  "LLM",
  "Portfolio",
  "Pakistan Developer",
  "Autonomous AI Systems",
  "Full Stack Engineer",
];

/* ─── Root metadata ─── */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: title,
    template: `%s — ${siteName}`,
  },
  description,
  keywords,
  authors: [{ name: siteName, url: siteUrl }],
  creator: siteName,
  publisher: siteName,

  /* ── Canonical & alternates ── */
  alternates: {
    canonical: siteUrl,
  },

  /* ── Open Graph ── */
  openGraph: {
    type: "website",
    url: siteUrl,
    siteName,
    title,
    description,
    locale: "en_US",
    images: [
      {
        url: "/opengraph-image.png",
        width: 1200,
        height: 630,
        alt: `${siteName} — Agentic AI & Fullstack Developer`,
        type: "image/png",
      },
    ],
  },

  /* ── Twitter / X ── */
  twitter: {
    card: "summary_large_image",
    title,
    description,
    creator: "@syedabdullahzaidi",
    images: ["/opengraph-image.png"],
  },

  /* ── Icons ── */
  icons: {
    icon: [
      { url: "/icon.png", type: "image/png" },
    ],
    apple: [
      { url: "/apple-icon.png", type: "image/png" },
    ],
    shortcut: "/icon.png",
  },

  /* ── Robots ── */
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },

  /* ── Verification (add tokens when available) ── */
  // verification: {
  //   google: "GOOGLE_SEARCH_CONSOLE_TOKEN",
  // },

  /* ── App info ── */
  applicationName: siteName,
  category: "technology",
};

/* ─── Viewport (separate export per Next.js 14) ─── */
export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ─── JSON-LD structured data ─── */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: siteName,
  url: siteUrl,
  image: `${siteUrl}/opengraph-image.png`,
  sameAs: [
    "https://github.com/syedabdullahzaidi786",
    "https://linkedin.com/in/syed-abdullah-zaidi-4954a7395",
  ],
  jobTitle: "Agentic AI Developer & Fullstack Engineer",
  description,
  knowsAbout: [
    "Agentic AI",
    "Multi-Agent Systems",
    "RAG Pipelines",
    "Next.js",
    "React",
    "TypeScript",
    "FastAPI",
    "Python",
    "PostgreSQL",
    "Fullstack Development",
  ],
  worksFor: {
    "@type": "Organization",
    name: "Freelance / Independent",
  },
};

/* ─── Critical inline CSS (prevents FOUC before JS hydrates) ─── */
const criticalCSS = `
body { background: #000; color: #fff; margin: 0; }
#init-splash {
  position: fixed; inset: 0; z-index: 999999;
  display: flex; align-items: center; justify-content: center;
  background: #000;
  transition: opacity 0.3s ease, visibility 0.3s ease;
}
#init-splash.hidden { opacity: 0; visibility: hidden; pointer-events: none; }
#init-splash h1 {
  font-size: clamp(1.5rem, 4vw, 2rem); font-weight: 900;
  color: #fff; margin: 0; letter-spacing: -0.03em;
}
`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <head>
        <style dangerouslySetInnerHTML={{ __html: criticalCSS }} />

        {/* JSON-LD structured data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Splash hide script */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if (typeof window !== 'undefined') {
                window.addEventListener('DOMContentLoaded', function() {
                  var s = document.getElementById('init-splash');
                  if (s) s.classList.add('hidden');
                });
                setTimeout(function() {
                  var s = document.getElementById('init-splash');
                  if (s) s.classList.add('hidden');
                }, 500);
              }
            `,
          }}
        />

        {/* DNS prefetch */}
        <link rel="preconnect" href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://vercel.live" />
      </head>
      <body className="antialiased">
        <div id="init-splash" aria-hidden="true">
          <h1>SYED ABDULLAH ZAIDI</h1>
        </div>
        <div className="grain-overlay" aria-hidden="true" />
        <div className="vignette" aria-hidden="true" />
        <div className="atmos-glow" aria-hidden="true" />
        <ScrollProgress />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
