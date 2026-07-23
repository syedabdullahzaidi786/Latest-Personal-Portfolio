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
const siteUrl  = "https://latest-personal-portfolio-gamma.vercel.app";
const name     = "Syed Abdullah Zaidi";
const title    = "Syed Abdullah Zaidi | Agentic AI & Fullstack Developer — Portfolio";
const desc     =
  "Official Portfolio of Syed Abdullah Zaidi — Agentic AI Developer and Fullstack Engineer from Karachi, Pakistan. Expert in autonomous AI systems, multi-agent workflows, RAG pipelines, Next.js, FastAPI, and TypeScript. View projects, blogs, and achievements.";

const keywords = [
  // Name variations — most important for personal brand ranking
  "Syed Abdullah Zaidi",
  "Syed Abdullah Zaidi Portfolio",
  "Syed Abdullah Zaidi Developer",
  "Syed Abdullah Zaidi AI",
  "Abdullah Zaidi Developer",
  "Abdullah Zaidi Portfolio",
  // Role keywords
  "Agentic AI Developer",
  "Fullstack Developer Pakistan",
  "AI Engineer Karachi",
  "Next.js Developer Pakistan",
  "RAG Pipeline Developer",
  "Multi-Agent AI Systems",
  "LLM Developer",
  "FastAPI Developer",
  "React Developer Pakistan",
  "TypeScript Developer",
  // Discovery keywords
  "Portfolio website",
  "GIAIC Developer",
  "FUUAST Developer",
  "Karachi AI developer",
  "Pakistan Fullstack developer",
];

/* ─── Root metadata ─── */
export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default: title,
    template: `%s | Syed Abdullah Zaidi`,
  },
  description: desc,
  keywords,
  authors:   [{ name, url: siteUrl }],
  creator:   name,
  publisher: name,

  alternates: { canonical: siteUrl },

  openGraph: {
    type:        "profile",
    url:         siteUrl,
    siteName:    name,
    title,
    description: desc,
    locale:      "en_US",
    firstName:   "Syed Abdullah",
    lastName:    "Zaidi",
    username:    "syedabdullahzaidi786",
    images: [
      {
        url:    "/opengraph-image.png",
        width:  1200,
        height: 630,
        alt:    `${name} — Agentic AI & Fullstack Developer Portfolio`,
        type:   "image/png",
      },
    ],
  },

  twitter: {
    card:        "summary_large_image",
    title,
    description: desc,
    creator:     "@syedabdullahzaidi",
    images:      ["/opengraph-image.png"],
  },

  icons: {
    icon:     [{ url: "/icon.png", type: "image/png" }],
    apple:    [{ url: "/apple-icon.png", type: "image/png" }],
    shortcut: "/icon.png",
  },

  robots: {
    index:  true,
    follow: true,
    googleBot: {
      index:                true,
      follow:               true,
      "max-video-preview":  -1,
      "max-image-preview":  "large",
      "max-snippet":        -1,
    },
  },

  verification: { google: "google1b2ca50462ca8516" },

  applicationName: `${name} Portfolio`,
  category:        "technology",
};

export const viewport: Viewport = {
  themeColor:   "#000000",
  width:        "device-width",
  initialScale: 1,
  maximumScale: 5,
};

/* ─── JSON-LD: Person + WebSite (two schemas, both needed) ─── */
const jsonLd = [
  /* 1. Person schema — what Google uses for knowledge panel */
  {
    "@context":   "https://schema.org",
    "@type":      "Person",
    "@id":        `${siteUrl}/#person`,
    name,
    givenName:    "Syed Abdullah",
    familyName:   "Zaidi",
    alternateName: ["Abdullah Zaidi", "Syed Abdullah"],
    url:          siteUrl,
    image: {
      "@type":    "ImageObject",
      url:        `${siteUrl}/opengraph-image.png`,
      width:      1200,
      height:     630,
    },
    sameAs: [
      "https://github.com/syedabdullahzaidi786",
      "https://linkedin.com/in/syed-abdullah-zaidi-4954a7395",
      "https://syedabdullahzaidi.vercel.app",
    ],
    jobTitle:  "Agentic AI Developer & Fullstack Engineer",
    worksFor: {
      "@type": "Organization",
      name:    "Freelance",
    },
    address: {
      "@type":            "PostalAddress",
      addressLocality:    "Karachi",
      addressCountry:     "PK",
    },
    email:       "syedabdullahzaidi786@gmail.com",
    description: desc,
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
      "LLM",
      "OpenAI",
      "Docker",
    ],
    alumniOf: {
      "@type": "CollegeOrUniversity",
      name:    "FUUAST",
    },
    hasCredential: {
      "@type":       "EducationalOccupationalCredential",
      name:          "GIAIC Certification",
      credentialCategory: "Certificate",
      recognizedBy: {
        "@type": "Organization",
        name:    "Governor's Initiative for AI & Computing",
      },
    },
  },

  /* 2. WebSite schema — enables Google sitelinks search box */
  {
    "@context":  "https://schema.org",
    "@type":     "WebSite",
    "@id":       `${siteUrl}/#website`,
    url:         siteUrl,
    name:        `${name} — Portfolio`,
    description: desc,
    author: { "@id": `${siteUrl}/#person` },
    inLanguage:  "en-US",
    potentialAction: {
      "@type":       "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: `${siteUrl}/blogs?q={search_term_string}`,
      },
      "query-input": "required name=search_term_string",
    },
  },

  /* 3. ProfilePage schema — newer Google signal for personal sites */
  {
    "@context":  "https://schema.org",
    "@type":     "ProfilePage",
    "@id":       `${siteUrl}/#profilepage`,
    url:         siteUrl,
    name:        `${name} — Official Portfolio`,
    dateCreated: "2024-01-01",
    dateModified: new Date().toISOString().split("T")[0],
    mainEntity:  { "@id": `${siteUrl}/#person` },
  },
];

/* ─── Critical inline CSS ─── */
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

        {/* Combined JSON-LD array — 3 schemas in one script tag */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />

        {/* Splash hide */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(typeof window!=='undefined'){window.addEventListener('DOMContentLoaded',function(){var s=document.getElementById('init-splash');if(s)s.classList.add('hidden')});setTimeout(function(){var s=document.getElementById('init-splash');if(s)s.classList.add('hidden')},500)}`,
          }}
        />

        <link rel="preconnect"  href="https://vercel.live" />
        <link rel="dns-prefetch" href="https://vercel.live" />
      </head>
      <body className="antialiased">
        <div id="init-splash" aria-hidden="true">
          <h1>SYED ABDULLAH ZAIDI</h1>
        </div>
        <div className="grain-overlay" aria-hidden="true" />
        <div className="vignette"      aria-hidden="true" />
        <div className="atmos-glow"    aria-hidden="true" />
        <ScrollProgress />
        {children}
        <CustomCursor />
      </body>
    </html>
  );
}
